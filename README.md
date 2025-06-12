# Pictionary Game

[![GitHub](https://img.shields.io/github/license/kirkland1/PictionaryGame)](https://github.com/kirkland1/PictionaryGame)
[![GitHub stars](https://img.shields.io/github/stars/kirkland1/PictionaryGame)](https://github.com/kirkland1/PictionaryGame/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/kirkland1/PictionaryGame)](https://github.com/kirkland1/PictionaryGame/network/members)

A real-time multiplayer Pictionary game built with React, TypeScript, Tailwind CSS, and FastAPI. Players can create rooms, draw pictures, and guess words in real-time.

## Repository

- **GitHub**: [https://github.com/kirkland1/PictionaryGame](https://github.com/kirkland1/PictionaryGame)
- **License**: MIT License

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/kirkland1/PictionaryGame.git
   cd PictionaryGame
   ```

2. Make sure you have the prerequisites installed:
   - Python 3.8+
   - Node.js 16+
   - npm or yarn

## Features

- Real-time drawing and guessing
- Multiple concurrent game rooms
- Player scoring system
- Word selection system
- Chat functionality
- Responsive design for both desktop and mobile
- Copy room ID to clipboard
- Player list with scores

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Project Structure

```
.
├── backend/           # FastAPI backend
│   ├── app/
│   │   └── main.py   # Main application file
│   ├── requirements.txt
│   └── .env.example
└── frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── Home.tsx
    │   │   └── GameRoom.tsx
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── .env.example
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

The backend will run on http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (using legacy peer deps to handle React version compatibility):
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install --legacy-peer-deps
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The frontend will run on http://localhost:3000

## How to Play

1. **Starting a Game**:
   - Open http://localhost:3000 in your browser
   - Enter your name
   - Click "Create Room"
   - Copy the room ID and share it with friends
   - Click "Start Game" to enter the room

2. **Joining a Game**:
   - Open http://localhost:3000 in your browser
   - Enter your name
   - Enter the room ID shared by the host
   - Click "Join Room"

3. **Gameplay**:
   - The game randomly selects a player to draw
   - The drawer sees the word they need to draw
   - Other players see the drawing in real-time
   - Players can submit guesses in the chat
   - Correct guesses earn points
   - Click "Start New Round" to begin a new round

## Game Rules

1. Each round, one player is randomly selected to draw
2. The drawer has 60 seconds to draw the given word
3. Other players try to guess the word
4. First player to guess correctly gets a point
5. A new round starts when someone guesses correctly or time runs out
6. Minimum 2 players required to start a game
7. Maximum 8 players per room

## Troubleshooting

### Common Issues

1. **WebSocket Connection Issues**:
   - Ensure both backend and frontend servers are running
   - Check browser console for connection errors
   - Verify you're using the correct room ID

2. **Drawing Not Working**:
   - Make sure you're the current drawer
   - Check if the canvas is enabled (not disabled)
   - Try refreshing the page if issues persist

3. **Guessing Not Working**:
   - Ensure you're not the current drawer
   - Check if the round is active
   - Verify your guess is spelled correctly

### Development

- Backend API documentation available at:
  - Swagger UI: http://localhost:8000/docs
  - ReDoc: http://localhost:8000/redoc

- Frontend development:
  - Uses Vite for fast development
  - Hot module replacement enabled
  - TypeScript for type safety
  - Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 