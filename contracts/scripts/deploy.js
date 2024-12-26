const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploying NativeLiquidityPool
  console.log("\nDeploying NativeLiquidityPool...");
  const NativeLiquidityPool = await ethers.getContractFactory(
    "NativeLiquidityPool"
  );
  const nativeLiquidityPool = await NativeLiquidityPool.deploy();
  console.log("NativeLiquidityPool deployed to:", nativeLiquidityPool.target);

  // Deploying TokenFactory
  console.log("\nDeploying TokenFactory...");
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy(nativeLiquidityPool.target);
  console.log("TokenFactory deployed to:", tokenFactory.target);

  // // Creating MemeToken
  // console.log("\nCreating MemeToken...");
  // const createTokenTx = await tokenFactory.createMemeToken(
  //   "MemeToken",
  //   "MEME",
  //   "https://ipfs.io/ipfs/QmZ8T1sQ9V1Zf2Q5Y2tZ5cYXo3v4p2VYv6u7mUuV4QwQ1d",
  //   "A meme token", // Replace with the required ETH amount based on bonding curve cost
  //   {
  //     gasLimit: 5000000,
  //   }
  // );
  // const createTokenReceipt = await createTokenTx.wait();
  // console.log("MemeToken created in transaction:", createTokenReceipt);

  // // function getMemeTokenCount() public view returns (uint) {
  // console.log("\nGetting MemeToken count...");
  // const memeTokenCount = await tokenFactory.getMemeTokenCount();
  // console.log("MemeToken Count:", memeTokenCount.toString());

  // // Retrieving the address of the created MemeToken
  // const memeTokenAddress = await tokenFactory.memeTokenAddresses(0);
  // console.log("\nMemeToken Address:", memeTokenAddress);

  // // function getMemeTokenByIndex(uint index)
  // console.log("\nGetting MemeToken by index...");
  // for (let i = 0; i < memeTokenCount; i++) {
  //   const memeToken = await tokenFactory.getMemeTokenByIndex(i);
  //   console.log(`MemeToken at index ${i}:`, memeToken);
  // }

  // // function getAllMemeTokens()
  // console.log("\nGetting all MemeTokens...");
  // const allMemeTokens = await tokenFactory.getAllMemeTokens();
  // console.log("All MemeTokens:", allMemeTokens);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
