// Payment.js
// PaymentPage.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import PaymentContractABI from './PaymentContract.json'; // Adjusted to match the current structure

import './Payment.css';


const contractAddress = '0x12e31C3ECD08d3b5C0775F623db3bdd7ec1e2931'; // Replace with the deployed contract address

function PaymentPage() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [userBalance, setUserBalance] = useState(null);

  // Connect to the contract and deposit ETH
  const handleDeposit = async () => {
    if (!depositAmount) {
      alert('Please enter an amount to deposit.');
      return;
    }

    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, PaymentContractABI.abi, signer);

        const tx = await contract.deposit({
          value: ethers.parseEther(depositAmount),
        });
        await tx.wait();
        alert('Deposit successful!');
      } catch (error) {
        console.error('Error depositing:', error);
        alert('Deposit failed. Please try again.');
      }
    } else {
      alert('MetaMask is not installed.');
    }
  };

  // Connect to the contract and withdraw ETH
  const handleWithdraw = async () => {
    if (!withdrawAmount) {
      alert('Please enter an amount to withdraw.');
      return;
    }

    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, PaymentContractABI.abi, signer);

        const tx = await contract.withdraw(ethers.parseEther(withdrawAmount));
        await tx.wait();
        alert('Withdrawal successful!');
      } catch (error) {
        console.error('Error withdrawing:', error);
        alert('Withdrawal failed. Please try again.');
      }
    } else {
      alert('MetaMask is not installed.');
    }
  };

  // Fetch the user's balance in the contract
  const fetchBalance = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, PaymentContractABI.abi, signer);

        const balance = await contract.balances(await signer.getAddress());
        setUserBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    } else {
      alert('MetaMask is not installed.');
    }
  };

  return (
    <div className="payment-page">
      <h2>Payment Page</h2>
      <div className="balance-container">
        <button onClick={fetchBalance}>Get Balance</button>
        {userBalance !== null && <p>Your Balance: {userBalance} ETH</p>}
      </div>
      <div className="deposit-container">
        <label>
          Deposit Amount (ETH):
          <input
            type="text"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
        </label>
        <button onClick={handleDeposit}>Deposit</button>
      </div>
      <div className="withdraw-container">
        <label>
          Withdraw Amount (ETH):
          <input
            type="text"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
        </label>
        <button onClick={handleWithdraw}>Withdraw</button>
      </div>
    </div>
  );
}

export default PaymentPage;
