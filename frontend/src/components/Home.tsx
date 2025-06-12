import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showRoomId, setShowRoomId] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!playerName) {
      setError('Please enter your name');
      return;
    }
    const newRoomId = Math.random().toString(36).substring(2, 8);
    setRoomId(newRoomId);
    setShowRoomId(true);
    setError('');
  };

  const handleJoinRoom = () => {
    if (!playerName) {
      setError('Please enter your name');
      return;
    }
    if (!roomId) {
      setError('Please enter a room ID');
      return;
    }
    console.log('Joining room:', roomId, 'as player:', playerName);
    navigate(`/room/${roomId}?player=${encodeURIComponent(playerName)}`);
  };

  const handleStartGame = () => {
    if (!playerName || !roomId) {
      setError('Please enter your name and create a room');
      return;
    }
    console.log('Starting game in room:', roomId, 'as player:', playerName);
    navigate(`/room/${roomId}?player=${encodeURIComponent(playerName)}`);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Pictionary Game</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setError('');
            }}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Create New Room</h2>
            <button
              onClick={handleCreateRoom}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Room
            </button>
          </div>

          {showRoomId && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Share this Room ID with your friends:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white px-3 py-2 rounded border text-lg font-mono">
                  {roomId}
                </code>
                <button
                  onClick={copyRoomId}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <button
                onClick={handleStartGame}
                className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Start Game
              </button>
            </div>
          )}

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-4">Join Existing Room</h2>
            <div className="mb-4">
              <input
                type="text"
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                  setError('');
                }}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter room ID"
              />
            </div>
            <button
              onClick={handleJoinRoom}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 