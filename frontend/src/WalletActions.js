// WalletActions.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './WalletActions.css';

const contractAddress = '0x12e31C3ECD08d3b5C0775F623db3bdd7ec1e2931'; // Replace with your contract address
const contractABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "balances",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

function WalletActions() {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    if (window.ethereum) {
      updateBalance();
    }
  }, []);

  const updateBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const userAddress = await signer.getAddress();
      const userBalance = await contract.balances(userAddress);
      setBalance(ethers.formatEther(userBalance));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleDeposit = async () => {
    if (!amount) return alert('Please enter an amount to deposit.');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const transaction = await signer.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther(amount),
      });

      await transaction.wait();
      alert('Deposit successful!');
      updateBalance();
    } catch (error) {
      console.error('Deposit failed:', error);
      alert('Deposit failed. Please check the transaction details or try again.');
    }
  };

  const handleWithdraw = async () => {
    if (!amount) return alert('Please enter an amount to withdraw.');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contract.withdraw(ethers.parseEther(amount));
      await tx.wait();
      alert('Withdrawal successful!');
      updateBalance();
    } catch (error) {
      console.error('Withdrawal failed:', error);
      alert('Withdrawal failed. Please check the transaction details or try again.');
    }
  };

  return (
    <div className="wallet-actions">
      <p>Current Balance: {balance} ETH</p>
      <input
        type="text"
        placeholder="Enter amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleDeposit}>Deposit</button>
      <button onClick={handleWithdraw}>Withdraw</button>
    </div>
  );
}

export default WalletActions;
