// BettingPage.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import SportsBettingABI from './SportsBettingABI.json';
import './BettingPage.css';

const contractAddress = '0x12e31C3ECD08d3b5C0775F623db3bdd7ec1e2931'; // Replace with deployed contract address

function BettingPage() {
  const { state } = useLocation();
  const game = state?.game;
  const [betAmount, setBetAmount] = useState('');
  const [betOption, setBetOption] = useState(''); // "TeamA" or "TeamB"
  const [selectedTeam, setSelectedTeam] = useState(''); // Store selected team name
  const [transactionHash, setTransactionHash] = useState('');

  // Function to handle input change and restrict to valid floating-point numbers
  const handleBetAmountChange = (e) => {
    const value = e.target.value;

    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setBetAmount(value);
    }
  };

  // Function to handle team selection
  const handleTeamChange = (e) => {
    const option = e.target.value;
    setBetOption(option);
    
    // Set the selected team name based on the chosen option
    if (option === 'TeamA') {
      setSelectedTeam(game?.home.name);
    } else if (option === 'TeamB') {
      setSelectedTeam(game?.away.name);
    } else {
      setSelectedTeam('');
    }
  };

  // Function to handle the bet placement
  const handleBet = async () => {
    if (!betAmount || !betOption) {
      alert('Please select a team and enter an amount.');
      return;
    }

    // Ensure betAmount is a valid number
    const formattedBetAmount = betAmount.trim();
    if (isNaN(formattedBetAmount) || Number(formattedBetAmount) <= 0) {
      alert('Please enter a valid positive bet amount.');
      return;
    }

    try {
      // Convert the bet amount to wei format
      const weiValue = ethers.parseUnits(formattedBetAmount, "ether");
      console.log("Parsed Bet Amount (in wei):", weiValue.toString());

      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, SportsBettingABI.abi, signer);

        const tx = await contract.placeBet(game.id, betOption === 'TeamA' ? 0 : 1, {
          value: weiValue,
        });

        await tx.wait();
        setTransactionHash(tx.hash);
        
        // Display success message with the selected team name
        alert(`Bet placed successfully on ${selectedTeam}! Transaction Hash: ${tx.hash}`);
      } else {
        alert('MetaMask is not installed.');
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      alert(`Bet placed successfully🎉 on ${selectedTeam}!`);
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
            onChange={handleBetAmountChange}
            placeholder="Enter bet amount in ETH"
          />
        </label>
        <label>
          Choose Team:
          <select value={betOption} onChange={handleTeamChange}>
            <option value="">Select Team</option>
            <option value="TeamA">{game?.home.name}</option>
            <option value="TeamB">{game?.away.name}</option>
          </select>
        </label>
        <button onClick={handleBet}>Place Bet</button>
        {transactionHash && (
          <p>
            Transaction Hash: <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">{transactionHash}</a>
          </p>
        )}
      </div>
    </div>
  );
}

export default BettingPage;
