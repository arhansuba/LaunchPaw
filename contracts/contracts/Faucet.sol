// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Faucet {
    uint256 public constant FAUCET_AMOUNT = 1 ether;
    uint256 public constant COOLDOWN_TIME = 24 hours;
    
    mapping(address => uint256) public lastFaucetTime;
    
    event FaucetClaimed(address indexed recipient, uint256 amount, uint256 timestamp);
    
    error CooldownNotExpired(uint256 remainingTime);
    error FaucetDrainFailed();
    error InvalidReceiver();
    error InsufficientFaucetBalance();
    
    receive() external payable {}
    
    function claimTokens(address receiver) external {
        if (receiver == address(0)) revert InvalidReceiver();
        
        if (block.timestamp < lastFaucetTime[receiver] + COOLDOWN_TIME) {
            uint256 remainingTime = lastFaucetTime[receiver] + COOLDOWN_TIME - block.timestamp;
            revert CooldownNotExpired(remainingTime);
        }
        
        if (address(this).balance < FAUCET_AMOUNT) {
            revert InsufficientFaucetBalance();
        }
        
        lastFaucetTime[receiver] = block.timestamp;
        
        (bool success, ) = payable(receiver).call{value: FAUCET_AMOUNT}("");
        if (!success) revert FaucetDrainFailed();
        
        emit FaucetClaimed(receiver, FAUCET_AMOUNT, block.timestamp);
    }
    
    function getRemainingCooldown(address user) external view returns (uint256) {
        if (block.timestamp >= lastFaucetTime[user] + COOLDOWN_TIME) {
            return 0;
        }
        return lastFaucetTime[user] + COOLDOWN_TIME - block.timestamp;
    }
    
}