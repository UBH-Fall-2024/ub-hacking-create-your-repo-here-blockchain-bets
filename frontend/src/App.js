// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConnectButton from './ConnectButton';
import LiveScores from './LiveScores';
import BettingPage from './BettingPage';
import './App.css';


function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleWalletConnection = (connected) => {
    setIsWalletConnected(connected);
  };

  return (
    <Router>
      <div className="App">
        <ConnectButton onWalletConnect={handleWalletConnection} />
        <header className="App-header">
          <h1>NBA Live Betting</h1>
          <Routes>
            <Route
              path="/"
              element={<LiveScores isWalletConnected={isWalletConnected} />}
            />
            <Route path="/betting" element={<BettingPage />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
