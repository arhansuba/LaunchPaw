// // import { ethers } from "ethers";

// // interface BondingCurveMetrics {
// //   progress: number;
// //   availableTokens: string;
// //   currentLiquidity: string;
// //   targetLiquidity: string;
// // }

// // export const calculateBondingCurve = (
// //   currentSupply: bigint,
// //   maxSupply: bigint = ethers.parseEther("1000"), // 1000 tokens max supply
// //   initialSupply: bigint = ethers.parseEther("200"), // 200 tokens initial supply
// //   currentPrice: string = "0.000033"
// // ): BondingCurveMetrics => {
// //   // Calculate available supply (excluding initial supply)
// //   const availableSupply = maxSupply - initialSupply;
// //   const soldSupply = currentSupply - initialSupply;

// //   // Calculate progress percentage
// //   const progress = Number(
// //     (soldSupply * BigInt(10000)) / availableSupply / BigInt(100)
// //   );

// //   // Calculate remaining available tokens
// //   const availableTokens = ethers.formatEther(availableSupply - soldSupply);

// //   // Calculate current liquidity in the bonding curve
// //   const currentLiquidity = ethers.formatEther(
// //     soldSupply * BigInt(Math.floor(Number(currentPrice) * 1e18))
// //   );

// //   // Calculate target liquidity (when all tokens are sold)
// //   const targetLiquidity = ethers.formatEther(
// //     availableSupply * BigInt(Math.floor(Number(currentPrice) * 1e18))
// //   );

// //   return {
// //     progress: Math.min(100, Math.max(0, progress)), // Ensure between 0-100
// //     availableTokens,
// //     currentLiquidity,
// //     targetLiquidity,
// //   };
// // };

// import { ethers } from "ethers";

// const SCALE = 1e6; // Scaling factor for calculations
// const K = 1; // Bonding curve steepness parameter
// const INITIAL_PRICE = ethers.parseEther("0.0001"); // Initial token price in AVAX

// // Helper function to calculate exponential (e^x)
// function exp(x: number): number {
//   return Math.exp(x);
// }

// export function calculateTokenPrice(
//   currentSupply: bigint,
//   amount: bigint = BigInt(1)
// ): string {
//   const supplyNum = Number(ethers.formatEther(currentSupply));
//   const amountNum = Number(ethers.formatEther(amount));

//   // Calculate price using the bonding curve formula
//   const exponent = (K * (supplyNum + amountNum)) / SCALE;
//   const price = Number(ethers.formatEther(INITIAL_PRICE)) * exp(exponent);

//   return ethers.parseEther(price.toFixed(18)).toString();
// }

// export function calculatePurchaseCost(
//   currentSupply: bigint,
//   tokensToBuy: bigint
// ): string {
//   const supplyNum = Number(ethers.formatEther(currentSupply));
//   const buyNum = Number(ethers.formatEther(tokensToBuy));

//   // Calculate exponents
//   const exponent1 = (K * (supplyNum + buyNum)) / SCALE;
//   const exponent2 = (K * supplyNum) / SCALE;

//   // Calculate e^(kx)
//   const exp1 = exp(exponent1);
//   const exp2 = exp(exponent2);

//   // Calculate cost: (P0 / k) * (e^(k * (currentSupply + tokensToBuy)) - e^(k * currentSupply))
//   const initialPrice = Number(ethers.formatEther(INITIAL_PRICE));
//   const cost = (initialPrice * (exp1 - exp2)) / K;

//   return ethers.parseEther(cost.toFixed(18)).toString();
// }

// export function calculateSaleReturn(
//   currentSupply: bigint,
//   tokensToSell: bigint
// ): string {
//   const supplyNum = Number(ethers.formatEther(currentSupply));
//   const sellNum = Number(ethers.formatEther(tokensToSell));

//   // Calculate exponents
//   const exponent1 = (K * supplyNum) / SCALE;
//   const exponent2 = (K * (supplyNum - sellNum)) / SCALE;

//   // Calculate e^(kx)
//   const exp1 = exp(exponent1);
//   const exp2 = exp(exponent2);

//   // Calculate return: (P0 / k) * (e^(k * currentSupply) - e^(k * (currentSupply - tokensToSell)))
//   const initialPrice = Number(ethers.formatEther(INITIAL_PRICE));
//   const returnAmount = (initialPrice * (exp1 - exp2)) / K;

//   return ethers.parseEther(returnAmount.toFixed(18)).toString();
// }

// export interface BondingCurveMetrics {
//   currentPrice: string;
//   nextPrice: string;
//   priceImpact: number;
//   slippage: number;
//   liquidityDepth: string;
// }

// export function getBondingCurveMetrics(
//   currentSupply: bigint,
//   amount: bigint = BigInt(1)
// ): BondingCurveMetrics {
//   const currentPrice = calculateTokenPrice(currentSupply);
//   const nextPrice = calculateTokenPrice(currentSupply + amount);

//   const currentPriceNum = Number(ethers.formatEther(BigInt(currentPrice)));
//   const nextPriceNum = Number(ethers.formatEther(BigInt(nextPrice)));

//   const priceImpact =
//     ((nextPriceNum - currentPriceNum) / currentPriceNum) * 100;
//   const slippage = Math.abs(priceImpact);

//   // Calculate liquidity depth (total value locked in the bonding curve)
//   const liquidityDepth = calculatePurchaseCost(BigInt(0), currentSupply);

//   return {
//     currentPrice,
//     nextPrice,
//     priceImpact,
//     slippage,
//     liquidityDepth,
//   };
// }

import { ethers } from "ethers";

const SCALE = 1e6; // Scaling factor for calculations
const K = 1; // Bonding curve steepness parameter
const INITIAL_PRICE = ethers.parseEther("0.0001"); // Initial token price in AVAX
const MAX_SUPPLY = ethers.parseEther("1000"); // 1000 tokens max supply
const INITIAL_SUPPLY = ethers.parseEther("200"); // 200 tokens initial supply

// Helper function to calculate exponential (e^x)
function exp(x: number): number {
  return Math.exp(x);
}

export function calculateTokenPrice(
  currentSupply: bigint,
  amount: bigint = BigInt(1)
): string {
  const supplyNum = Number(ethers.formatEther(currentSupply));
  const amountNum = Number(ethers.formatEther(amount));

  // Calculate price using the bonding curve formula
  const exponent = (K * (supplyNum + amountNum)) / SCALE;
  const price = Number(ethers.formatEther(INITIAL_PRICE)) * exp(exponent);

  return ethers.parseEther(price.toFixed(18)).toString();
}

export function calculatePurchaseCost(
  currentSupply: bigint,
  tokensToBuy: bigint
): string {
  const supplyNum = Number(ethers.formatEther(currentSupply));
  const buyNum = Number(ethers.formatEther(tokensToBuy));

  // Calculate exponents
  const exponent1 = (K * (supplyNum + buyNum)) / SCALE;
  const exponent2 = (K * supplyNum) / SCALE;

  // Calculate e^(kx)
  const exp1 = exp(exponent1);
  const exp2 = exp(exponent2);

  // Calculate cost: (P0 / k) * (e^(k * (currentSupply + tokensToBuy)) - e^(k * currentSupply))
  const initialPrice = Number(ethers.formatEther(INITIAL_PRICE));
  const cost = (initialPrice * (exp1 - exp2)) / K;

  return ethers.parseEther(cost.toFixed(18)).toString();
}

export function calculateSaleReturn(
  currentSupply: bigint,
  tokensToSell: bigint
): string {
  const supplyNum = Number(ethers.formatEther(currentSupply));
  const sellNum = Number(ethers.formatEther(tokensToSell));

  // Calculate exponents
  const exponent1 = (K * supplyNum) / SCALE;
  const exponent2 = (K * (supplyNum - sellNum)) / SCALE;

  // Calculate e^(kx)
  const exp1 = exp(exponent1);
  const exp2 = exp(exponent2);

  // Calculate return: (P0 / k) * (e^(k * currentSupply) - e^(k * (currentSupply - tokensToSell)))
  const initialPrice = Number(ethers.formatEther(INITIAL_PRICE));
  const returnAmount = (initialPrice * (exp1 - exp2)) / K;

  return ethers.parseEther(returnAmount.toFixed(18)).toString();
}

export interface BondingCurveMetrics {
  currentPrice: string;
  nextPrice: string;
  priceImpact: number;
  slippage: number;
  liquidityDepth: string;
  availableSupply: string;
  soldSupply: string;
  progress: number;
}

export function getBondingCurveMetrics(
  currentSupply: bigint,
  amount: bigint = BigInt(1)
): BondingCurveMetrics {
  const currentPrice = calculateTokenPrice(currentSupply);
  const nextPrice = calculateTokenPrice(currentSupply + amount);

  const currentPriceNum = Number(ethers.formatEther(BigInt(currentPrice)));
  const nextPriceNum = Number(ethers.formatEther(BigInt(nextPrice)));

  const priceImpact =
    ((nextPriceNum - currentPriceNum) / currentPriceNum) * 100;
  const slippage = Math.abs(priceImpact);

  // Calculate liquidity depth (total value locked in the bonding curve)
  const liquidityDepth = calculatePurchaseCost(BigInt(0), currentSupply);

  // Calculate supply metrics
  const availableSupply = MAX_SUPPLY - INITIAL_SUPPLY;
  const soldSupply =
    currentSupply > INITIAL_SUPPLY ? currentSupply - INITIAL_SUPPLY : BigInt(0);
  const progress = Number(
    (soldSupply * BigInt(10000)) / availableSupply / BigInt(100)
  );

  return {
    currentPrice,
    nextPrice,
    priceImpact,
    slippage,
    liquidityDepth,
    availableSupply: ethers.formatEther(availableSupply),
    soldSupply: ethers.formatEther(soldSupply),
    progress,
  };
}
