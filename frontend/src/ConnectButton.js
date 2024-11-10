// ConnectButton.js
import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import WalletActions from './WalletActions';
import './ConnectButton.css';

function ConnectButton({ onWalletConnect }) {
  const [address, setAddress] = useState(null);
  const [showWalletActions, setShowWalletActions] = useState(false);

  // Function to connect to MetaMask
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
        localStorage.setItem('walletAddress', userAddress);
        onWalletConnect(true);
      } catch (error) {
        console.error('Connection error:', error);
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask!');
    }
  };

  // Function to disconnect the wallet
  const disconnect = () => {
    localStorage.removeItem('walletAddress');
    setAddress(null);
    setShowWalletActions(false);
    onWalletConnect(false);
  };

  // Toggle dropdown for WalletActions
  const toggleWalletActions = () => {
    setShowWalletActions((prev) => !prev);
  };

  // Effect to load address from localStorage on component mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setAddress(savedAddress);
      onWalletConnect(true);
    }
  }, [onWalletConnect]);

  return (
    <div className="connect-button-container">
      {address ? (
        <>
          <span className="connected-address">Connected: {address}</span>
          <button className="connect-button" onClick={disconnect}>Disconnect</button>
          <button className="dropdown-button" onClick={toggleWalletActions}>
            Wallet Options
          </button>
          {showWalletActions && <WalletActions />}
        </>
      ) : (
        <button className="connect-button" onClick={connectToMetaMask}>Connect to MetaMask</button>
      )}
    </div>
  );
}

export default ConnectButton;
