import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import GameRoom from './components/GameRoom';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<GameRoom />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 