// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "./Token.sol";
import "./NativeLiquidityPool.sol";
import "hardhat/console.sol";
import "./IBondingCurvePrecompile.sol";
import "./ITeleporterMessenge.sol";
import "./ITeleporterReceiver.sol";

contract TokenFactory is ITeleporterReceiver {
    struct memeToken {
        string name;
        string symbol;
        string description;
        string tokenImageUrl;
        uint fundingRaised;
        address tokenAddress;
        address creatorAddress;
        bool isLiquidityCreated;
        uint holders;
    }

    ITeleporterMessenger public immutable messenger = ITeleporterMessenger(0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf); 
    
    function receiveTeleporterMessage(bytes32 sourceBlockchainID, address originSenderAddress, bytes calldata message)
        external
    {
        // Only the Interchain Messaging receiver can deliver a message.
        require(msg.sender == address(messenger), "ReceiverOnSubnet: unauthorized TeleporterMessenger");

        // Process the received message (e.g., liquidity created, token deployed, etc.)
        (string memory action, address tokenAddress) = abi.decode(message, (string, address));

        if (keccak256(abi.encodePacked(action)) == keccak256(abi.encodePacked("LiquidityCreated"))) {
            // Update liquidity status across subnets
            addressToMemeTokenMapping[tokenAddress].isLiquidityCreated = true;
        }

        // Send Roundtrip message back to sender
        string memory response = string.concat(action, " processed on target subnet!");

        messenger.sendCrossChainMessage( 
            TeleporterMessageInput({
                // Blockchain ID of C-Chain
                destinationBlockchainID: sourceBlockchainID,
                destinationAddress: originSenderAddress,
                feeInfo: TeleporterFeeInfo({feeTokenAddress: address(0), amount: 0}),
                requiredGasLimit: 100000,
                allowedRelayerAddresses: new address[](0),
                message: abi.encode(response)
            })
        );
    }

    function sendLiquidityCreatedMessage(address destinationAddress, address tokenAddress) internal {
        messenger.sendCrossChainMessage( 
            TeleporterMessageInput({
                destinationBlockchainID: 0x3861e061737eaeb8d00f0514d210ad1062bfacdb4bd22d1d1f5ef876ae3a8921, 
                destinationAddress: destinationAddress, 
                feeInfo: TeleporterFeeInfo({feeTokenAddress: address(0), amount: 0}),
                requiredGasLimit: 100000,
                allowedRelayerAddresses: new address[](0) ,
                message: abi.encode("LiquidityCreated", tokenAddress)
            })
        );
    }

    address[] public memeTokenAddresses;
    mapping(address => memeToken) public addressToMemeTokenMapping;
    mapping(address => mapping(address => uint256)) public userTokenContributions;
    mapping(address => mapping(address => bool)) public hasClaimedReward;

    uint constant MEMECOIN_FUNDING_GOAL = 0.1 ether;
    uint constant MAX_SUPPLY = 10000;
    uint constant INIT_SUPPLY = 200; // 20% of MAX_SUPPLY
    uint constant BASE_REWARD_PERCENTAGE = 3; // 3% reward
    
    // Bonding curve constants
    uint256 constant INITIAL_PRICE = 0.0001 ether;
    uint256 constant K = 2 * 10**16; // Growth rate (0.02 scaled by 10^18)
    uint256 constant SCALE = 10**18;

    NativeLiquidityPool public nativeLiquidityPool;
    IBondingCurvePrecompile public bondingCurvePrecompile = IBondingCurvePrecompile(0x0300000000000000000000000000000000000002);
    event RewardClaimed(address indexed user, address indexed tokenAddress, uint256 amount);

    constructor(address _nativeLiquidityPoolAddress) {
        nativeLiquidityPool = NativeLiquidityPool(_nativeLiquidityPoolAddress);
    }

    function getCost(uint256 currentSupply, uint256 tokensToBuy) public returns (uint256) {
        return bondingCurvePrecompile.getCost(currentSupply, tokensToBuy);
    }

    function createMemeToken(string memory name, string memory symbol, string memory imageUrl, string memory description) public returns (address) {
        Token ct = new Token(name, symbol, INIT_SUPPLY);
        address memeTokenAddress = address(ct);
        memeToken memory newlyCreatedToken = memeToken(name, symbol, description, imageUrl, 0, memeTokenAddress, msg.sender, false, 0);
        memeTokenAddresses.push(memeTokenAddress);
        addressToMemeTokenMapping[memeTokenAddress] = newlyCreatedToken;
        console.log("MemeToken created with address: %s", memeTokenAddress);
        return memeTokenAddress;
    }

    function buyMemeToken(address memeTokenAddress, uint tokenQty) public payable returns (uint) {
        require(addressToMemeTokenMapping[memeTokenAddress].tokenAddress != address(0), "Token is not listed");
        
        memeToken storage listedToken = addressToMemeTokenMapping[memeTokenAddress];
        Token memeTokenCt = Token(memeTokenAddress);

        uint currentSupply = memeTokenCt.totalSupply();
        uint availableQty = MAX_SUPPLY - currentSupply;
        require(tokenQty <= availableQty, "Not enough available supply");

        uint currentSupplyWithoutInit = currentSupply - INIT_SUPPLY;
        uint requiredEth = getCost(currentSupplyWithoutInit, tokenQty);
        require(msg.value >= requiredEth, "Incorrect ETH amount sent");

        userTokenContributions[memeTokenAddress][msg.sender] += tokenQty;
        listedToken.fundingRaised += msg.value;

        if (listedToken.fundingRaised >= MEMECOIN_FUNDING_GOAL && !listedToken.isLiquidityCreated) {
            triggerLiquidityCreation(memeTokenAddress);
            listedToken.isLiquidityCreated = true;
            sendLiquidityCreatedMessage(msg.sender, memeTokenAddress);
        }
        listedToken.holders += 1;

        memeTokenCt.mint(tokenQty, msg.sender);
        return 1;
    }

    function sellMemeToken(address memeTokenAddress, uint tokenQty) public returns (uint) {
        require(addressToMemeTokenMapping[memeTokenAddress].tokenAddress != address(0), "Token is not listed");
        
        Token memeTokenCt = Token(memeTokenAddress);

        uint userBalance = memeTokenCt.balanceOf(msg.sender);
        require(userBalance >= tokenQty, "Insufficient token balance");

        uint currentSupply = memeTokenCt.totalSupply();
        uint currentSupplyWithoutInit = currentSupply - INIT_SUPPLY;
        uint ethToReturn = getCost(currentSupplyWithoutInit, tokenQty);

        require(userTokenContributions[memeTokenAddress][msg.sender] >= tokenQty, "Cannot sell more than contributed");
        userTokenContributions[memeTokenAddress][msg.sender] -= tokenQty;

        memeTokenCt.burn(tokenQty, msg.sender);

        (bool success, ) = msg.sender.call{value: ethToReturn}("");
        require(success, "ETH transfer failed");

        return 1;
    }

    function triggerLiquidityCreation(address memeTokenAddress) internal {
        uint256 avaxRaised = addressToMemeTokenMapping[memeTokenAddress].fundingRaised;
        Token memeTokenCt = Token(memeTokenAddress);
        
        memeTokenCt.approve(address(nativeLiquidityPool), INIT_SUPPLY);
        nativeLiquidityPool.addLiquidity{value: avaxRaised}(memeTokenAddress, INIT_SUPPLY);
        
    }

    function calculateReward(address memeTokenAddress, address user) public view returns (uint256) {
        if (!addressToMemeTokenMapping[memeTokenAddress].isLiquidityCreated || 
            hasClaimedReward[memeTokenAddress][user] ||
            userTokenContributions[memeTokenAddress][user] == 0) {
            return 0;
        }

        Token memeTokenCt = Token(memeTokenAddress);
        uint256 totalMintedSupply = memeTokenCt.totalSupply() - INIT_SUPPLY;
        uint256 userTokens = userTokenContributions[memeTokenAddress][user];
        
        return (addressToMemeTokenMapping[memeTokenAddress].fundingRaised * BASE_REWARD_PERCENTAGE * userTokens) / (totalMintedSupply * 100);
    }
    
    function claimReward(address memeTokenAddress) public {
        require(addressToMemeTokenMapping[memeTokenAddress].isLiquidityCreated, "Liquidity not created yet");
        require(!hasClaimedReward[memeTokenAddress][msg.sender], "Reward already claimed");
        require(userTokenContributions[memeTokenAddress][msg.sender] > 0, "No contribution found");

        uint256 reward = calculateReward(memeTokenAddress, msg.sender);
        require(reward > 0, "No reward available");

        hasClaimedReward[memeTokenAddress][msg.sender] = true;
        nativeLiquidityPool.mintReward(memeTokenAddress, msg.sender, reward);

        emit RewardClaimed(msg.sender, memeTokenAddress, reward);
    }

    function getAllMemeTokens() public view returns (memeToken[] memory) {
        memeToken[] memory allTokens = new memeToken[](memeTokenAddresses.length);
        for (uint i = 0; i < memeTokenAddresses.length; i++) {
            allTokens[i] = addressToMemeTokenMapping[memeTokenAddresses[i]];
        }
        return allTokens;
    }

    function getUserTokenContribution(address memeTokenAddress, address user) public view returns (uint256) {
        return userTokenContributions[memeTokenAddress][user];
    }

    function hasUserClaimedReward(address memeTokenAddress, address user) public view returns (bool) {
        return hasClaimedReward[memeTokenAddress][user];
    }

    function getMemeTokenCount() public view returns (uint) {
    return memeTokenAddresses.length;
    }

    function getMemeTokenByIndex(uint index) public view returns (string memory, string memory, string memory, string memory, uint, address, address, bool, uint) {
        require(index < memeTokenAddresses.length, "Index out of bounds");
        memeToken memory mt = addressToMemeTokenMapping[memeTokenAddresses[index]];
        return (mt.name, mt.symbol, mt.description, mt.tokenImageUrl, mt.fundingRaised, mt.tokenAddress, mt.creatorAddress, mt.isLiquidityCreated, mt.holders);
    }



}
