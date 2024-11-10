// BettingPage.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import SportsBettingABI from './SportsBettingABI.json'; // Import ABI
import './BettingPage.css';

const contractAddress = '0x12e31C3ECD08d3b5C0775F623db3bdd7ec1e2931'; // Replace with deployed contract address

function BettingPage() {
  const { state } = useLocation();
  const game = state?.game;
  const [betAmount, setBetAmount] = useState('');
  const [betOption, setBetOption] = useState(''); // "TeamA" or "TeamB"
  const [transactionHash, setTransactionHash] = useState('');

  // Function to handle the bet placement
  const handleBet = async () => {
    if (!betAmount || !betOption) {
      alert('Please select a team and enter an amount.');
      return;
    }

    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, SportsBettingABI.abi, signer);

      try {
        // Make sure `game.id` exists and `betOption` is set correctly
        const tx = await contract.placeBet(game.id, betOption === 'TeamA' ? 0 : 1, {
          value: ethers.parseEther(betAmount),
        });
        await tx.wait();
        setTransactionHash(tx.hash);
        alert('Bet placed successfully!');
      } catch (error) {
        console.error('Error placing bet:', error);
        alert('Bet failed. Please try again.');
      }
    } else {
      alert('MetaMask is not installed.');
    }
  };

  return (
    <div className="betting-page">
      <h2>Betting on: {game?.home.name} vs {game?.away.name}</h2>
      <div className="betting-form">
        <label>
          Bet Amount (ETH):
          <input
            type="text"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
          />
        </label>
        <label>
          Choose Team:
          <select value={betOption} onChange={(e) => setBetOption(e.target.value)}>
            <option value="">Select Team</option>
            <option value="TeamA">{game?.home.name}</option>
            <option value="TeamB">{game?.away.name}</option>
          </select>
        </label>
        <button onClick={handleBet}>Place Bet</button>
        {transactionHash && <p>Transaction Hash: {transactionHash}</p>}
      </div>
    </div>
  );
}

export default BettingPage;
