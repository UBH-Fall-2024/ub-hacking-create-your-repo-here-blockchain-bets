// ConnectButton.js
import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import './ConnectButton.css'; // Import the CSS file

function ConnectButton({ onWalletConnect }) {
  const [address, setAddress] = useState(null);

  // Function to connect to MetaMask
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        // Request account access from MetaMask
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Create a provider instance
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Get the user's address and save it
        const userAddress = await signer.getAddress();
        setAddress(userAddress);

        // Store the address in localStorage
        localStorage.setItem('walletAddress', userAddress);

        // Notify parent component of connection status
        onWalletConnect(true);
      } catch (error) {
        console.error('Connection error:', error);
      }
    } else {
      alert('MetaMask not detected. Please install MetaMask!');
    }
  };

  // Function to disconnect and clear the wallet address
  const disconnect = () => {
    localStorage.removeItem('walletAddress');
    setAddress(null);
    onWalletConnect(false); // Notify parent component of disconnection
  };

  // Effect to load address from localStorage on component mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    if (savedAddress) {
      setAddress(savedAddress);
      onWalletConnect(true); // Restore connection status on page load
    }
  }, [onWalletConnect]);

  return (
    <div className="connect-button-container">
      {address ? (
        <>
          <span className="connected-address">Connected: {address}</span>
          <button className="connect-button" onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button className="connect-button" onClick={connectToMetaMask}>Connect to MetaMask</button>
      )}
    </div>
  );
}

export default ConnectButton;

