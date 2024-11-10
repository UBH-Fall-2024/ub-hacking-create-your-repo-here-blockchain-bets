import './App.css';
import ConnectButton from './ConnectButton';
import LiveScores from './LiveScores';
import { useState } from 'react';

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleWalletConnection = (connected) => {
    setIsWalletConnected(connected);
  };

  return (
    <div className="App">
      <ConnectButton onWalletConnect={handleWalletConnection} />
      <header className="App-header">
        <h1>NBA Live Betting</h1>
        <LiveScores isWalletConnected={isWalletConnected} />
      </header>
    </div>
  );
}

export default App;
