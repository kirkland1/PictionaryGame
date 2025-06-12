from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Set
import json
import random
import asyncio
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Game state
class GameRoom:
    def __init__(self):
        self.players: Dict[str, WebSocket] = {}
        self.scores: Dict[str, int] = {}
        self.current_word: str = ""
        self.current_drawer: str = ""
        self.is_round_active: bool = False
        self.round_time: int = 60
        self.words: List[str] = [
            "apple", "banana", "cat", "dog", "elephant", "fish", "giraffe",
            "house", "ice cream", "jacket", "kite", "lion", "monkey", "notebook",
            "orange", "pencil", "queen", "rabbit", "sun", "tree", "umbrella",
            "violin", "watermelon", "xylophone", "yacht", "zebra"
        ]

    async def broadcast(self, message: dict):
        for player in self.players.values():
            try:
                await player.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting message: {e}")

    def select_new_word(self) -> str:
        return random.choice(self.words)

    def select_new_drawer(self) -> str:
        return random.choice(list(self.players.keys()))

game_rooms: Dict[str, GameRoom] = {}

@app.websocket("/ws/{room_id}/{player_name}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, player_name: str):
    await websocket.accept()
    logger.info(f"Player {player_name} joined room {room_id}")
    
    if room_id not in game_rooms:
        game_rooms[room_id] = GameRoom()
    
    room = game_rooms[room_id]
    room.players[player_name] = websocket
    room.scores[player_name] = 0

    # Notify all players about new player
    await room.broadcast({
        "type": "player_joined",
        "player": player_name,
        "players": list(room.players.keys()),
        "scores": room.scores
    })

    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"Received message from {player_name}: {data}")
            message = json.loads(data)

            if message["type"] == "draw":
                # Broadcast drawing data to all players except sender
                for player, ws in room.players.items():
                    if player != player_name:
                        try:
                            await ws.send_json({
                                "type": "draw",
                                "data": message["data"]
                            })
                        except Exception as e:
                            logger.error(f"Error sending drawing data: {e}")

            elif message["type"] == "guess":
                logger.info(f"Player {player_name} guessed: {message['guess']}")
                if room.is_round_active and message["guess"].lower() == room.current_word.lower():
                    # Correct guess
                    room.scores[player_name] += 1
                    await room.broadcast({
                        "type": "correct_guess",
                        "player": player_name,
                        "word": room.current_word,
                        "scores": room.scores
                    })
                    # End round
                    room.is_round_active = False

            elif message["type"] == "start_round":
                logger.info(f"Starting new round in room {room_id}")
                if len(room.players) >= 2:
                    room.current_word = room.select_new_word()
                    room.current_drawer = room.select_new_drawer()
                    room.is_round_active = True
                    
                    # Notify drawer of the word
                    try:
                        await room.players[room.current_drawer].send_json({
                            "type": "your_turn",
                            "word": room.current_word
                        })
                    except Exception as e:
                        logger.error(f"Error sending word to drawer: {e}")
                    
                    # Notify others that drawing is starting
                    for player, ws in room.players.items():
                        if player != room.current_drawer:
                            try:
                                await ws.send_json({
                                    "type": "round_start",
                                    "drawer": room.current_drawer
                                })
                            except Exception as e:
                                logger.error(f"Error notifying players about round start: {e}")

    except WebSocketDisconnect:
        logger.info(f"Player {player_name} left room {room_id}")
        # Remove player from room
        del room.players[player_name]
        del room.scores[player_name]
        
        # Notify remaining players
        await room.broadcast({
            "type": "player_left",
            "player": player_name,
            "players": list(room.players.keys()),
            "scores": room.scores
        })

        # Clean up empty rooms
        if not room.players:
            del game_rooms[room_id]

@app.get("/")
async def root():
    return {"message": "Pictionary Game API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 