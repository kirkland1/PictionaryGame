import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import CanvasDraw from 'react-canvas-draw';

interface Player {
  name: string;
  score: number;
}

const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('player') || '';
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [isDrawer, setIsDrawer] = useState(false);
  const [guess, setGuess] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  
  const canvasRef = useRef<CanvasDraw>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}/${playerName}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established');
      setMessages(prev => [...prev, 'Connected to game server']);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMessages(prev => [...prev, 'Error connecting to game server']);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setMessages(prev => [...prev, 'Disconnected from game server']);
    };

    ws.onmessage = (event) => {
      console.log('Received message:', event.data);
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'player_joined':
        case 'player_left':
          console.log('Player update:', data);
          setPlayers(Object.entries(data.scores).map(([name, score]) => ({
            name,
            score: score as number
          })));
          break;
        
        case 'your_turn':
          console.log('Your turn to draw:', data);
          setIsDrawer(true);
          setCurrentWord(data.word);
          setMessages([`It's your turn to draw! The word is: ${data.word}`]);
          break;
        
        case 'round_start':
          console.log('Round started:', data);
          setIsDrawer(false);
          setCurrentWord('');
          setMessages([`${data.drawer} is drawing...`]);
          break;
        
        case 'draw':
          console.log('Received drawing data');
          if (!isDrawer && canvasRef.current) {
            canvasRef.current.loadSaveData(data.data);
          }
          break;
        
        case 'correct_guess':
          console.log('Correct guess:', data);
          setMessages(prev => [...prev, `${data.player} guessed correctly! The word was ${data.word}`]);
          setPlayers(Object.entries(data.scores).map(([name, score]) => ({
            name,
            score: score as number
          })));
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, [roomId, playerName]);

  const handleDraw = () => {
    if (isDrawer && canvasRef.current) {
      const drawingData = canvasRef.current.getSaveData();
      console.log('Sending drawing data');
      wsRef.current?.send(JSON.stringify({
        type: 'draw',
        data: drawingData
      }));
    }
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDrawer && guess.trim()) {
      console.log('Sending guess:', guess);
      wsRef.current?.send(JSON.stringify({
        type: 'guess',
        guess: guess.trim()
      }));
      setGuess('');
    }
  };

  const startNewRound = () => {
    console.log('Starting new round');
    wsRef.current?.send(JSON.stringify({
      type: 'start_round'
    }));
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Players List */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Players</h2>
          <ul className="space-y-2">
            {players.map(player => (
              <li key={player.name} className="flex justify-between items-center">
                <span>{player.name}</span>
                <span className="font-bold">{player.score}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Drawing Area */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4">
              <CanvasDraw
                ref={canvasRef}
                onChange={handleDraw}
                disabled={!isDrawer}
                brushColor="#000000"
                brushRadius={2}
                canvasWidth={600}
                canvasHeight={400}
                className="border rounded-lg"
              />
            </div>
            
            {isDrawer && (
              <div className="mb-4">
                <p className="text-lg font-bold">Current word: {currentWord}</p>
              </div>
            )}

            {!isDrawer && (
              <form onSubmit={handleGuess} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Enter your guess"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Guess
                  </button>
                </div>
              </form>
            )}

            <button
              onClick={startNewRound}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Start New Round
            </button>
          </div>

          {/* Messages */}
          <div className="mt-4 bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="h-40 overflow-y-auto">
              {messages.map((message, index) => (
                <p key={index} className="mb-2">{message}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom; 