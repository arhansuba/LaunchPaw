// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Token.sol";
import "./INativeMinter.sol";

contract NativeLiquidityPool {
    INativeMinter public constant nativeMinter = INativeMinter(0x0200000000000000000000000000000000000001);
    
    // Track liquidity providers for each token
    mapping(address => mapping(address => bool)) public isLiquidityProvider;

    event LiquidityAdded(address indexed tokenAddress, address indexed provider, uint256 tokenAmount, uint256 avaxAmount);
    event RewardMinted(address indexed tokenAddress, address indexed recipient, uint256 amount);

    function addLiquidity(address tokenAddress, uint256 tokenAmount) external payable {
        require(msg.value > 0, "Must provide AVAX");
        require(tokenAmount > 0, "Must provide tokens");

        Token token = Token(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), tokenAmount), "Transfer failed");
        
        isLiquidityProvider[tokenAddress][msg.sender] = true;

        emit LiquidityAdded(tokenAddress, msg.sender, tokenAmount, msg.value);
    }

    function mintReward(address tokenAddress, address recipient, uint256 amount) external {
        require(isLiquidityProvider[tokenAddress][msg.sender], "Only liquidity providers can mint rewards");
        nativeMinter.mintNativeCoin(recipient, amount);
        emit RewardMinted(tokenAddress, recipient, amount);
    }
}