const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy NativeLiquidityPool first
  console.log("\nDeploying NativeLiquidityPool...");
  const NativeLiquidityPool = await ethers.getContractFactory("NativeLiquidityPool");
  const liquidityPool = await NativeLiquidityPool.deploy();
  await liquidityPool.waitForDeployment();
  const liquidityPoolAddress = await liquidityPool.getAddress();
  console.log("NativeLiquidityPool deployed to:", liquidityPoolAddress);

  // Deploy TokenFactory with liquidity pool address
  console.log("\nDeploying TokenFactory...");
  const TokenFactory = await ethers.getContractFactory("TokenFactory");
  const tokenFactory = await TokenFactory.deploy(liquidityPoolAddress);
  await tokenFactory.waitForDeployment();
  const tokenFactoryAddress = await tokenFactory.getAddress();
  console.log("TokenFactory deployed to:", tokenFactoryAddress);

  // Deploying BondingCurve
  console.log("\nDeploying BondingCurve...");
  const BondingCurve = await ethers.getContractFactory("BondingCurve");
  const bondingCurve = await BondingCurve.deploy();
  await bondingCurve.waitForDeployment();
  console.log("BondingCurve deployed to:", await bondingCurve.getAddress());

  // Deploying Faucet
  console.log("\nDeploying Faucet...");
  const Faucet = await ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy();
  await faucet.waitForDeployment();
  console.log("Faucet deployed to:", await faucet.getAddress());

  // Log all addresses for easy access
  console.log("\nDeployed Contract Addresses:");
  console.log("============================");
  console.log(`{
    "tokenFactory": "${await tokenFactory.getAddress()}",
    "bondingCurve": "${await bondingCurve.getAddress()}",
    "nativeLiquidityPool": "${await nativeLiquidityPool.getAddress()}",
    "faucet": "${await faucet.getAddress()}"
  }`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });