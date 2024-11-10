// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract PaymentContract {
    address public owner; // Owner of the contract

    // Mapping to store the balance of each user
    mapping(address => uint256) public balances;

    // Event to log deposits
    event Deposit(address indexed user, uint256 amount);

    // Event to log withdrawals
    event Withdrawal(address indexed user, uint256 amount);

    // Constructor to set the owner upon deployment
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict certain functions to the owner only
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    // Function to deposit ETH into the contract
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than zero.");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Function to withdraw ETH from the contract
    function withdraw(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Insufficient balance.");
        balances[msg.sender] -= _amount;
        
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Withdrawal failed.");
        
        emit Withdrawal(msg.sender, _amount);
    }

    // Function to get the balance of the contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Function for the owner to withdraw all funds from the contract
    function withdrawAll() external onlyOwner {
        uint256 contractBalance = address(this).balance;
        (bool success, ) = owner.call{value: contractBalance}("");
        require(success, "Owner withdrawal failed.");
    }
}
