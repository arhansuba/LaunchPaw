const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.utils.formatEther(balance), "ETH");

  // Deploying NativeLiquidityPool
  console.log("\nDeploying NativeLiquidityPool...");
  const NativeLiquidityPool = await hre.ethers.getContractFactory("NativeLiquidityPool");
  const nativeLiquidityPool = await NativeLiquidityPool.deploy();
  await nativeLiquidityPool.deployed();
  console.log("NativeLiquidityPool deployed to:", nativeLiquidityPool.address);

  // Deploying TokenFactory
  console.log("\nDeploying TokenFactory...");
  const TokenFactory = await hre.ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy(nativeLiquidityPool.address);
  await tokenFactory.deployed();
  console.log("TokenFactory deployed to:", tokenFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });