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
        <div className="main-heading-container">
            <h1 className="main-heading">Blockchain Bets 💰</h1>
            </div>

        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={<LiveScores isWalletConnected={isWalletConnected} />}
            />
            <Route path="/betting" element={<BettingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

