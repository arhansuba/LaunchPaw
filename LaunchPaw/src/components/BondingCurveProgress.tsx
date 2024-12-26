import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWalletClient } from "wagmi";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import { TokenFactoryABI, TokenABI } from "../abi";
import {
  calculatePurchaseCost,
  getBondingCurveMetrics,
} from "../utils/bondingCurve";
import { Coins } from "lucide-react";

interface BondingCurveProgressProps {
  currentSupply: bigint;
  tokenSymbol: string;
  currentPrice: string;
  tokenAddress: string;
}

interface MemeToken {
  name: string;
  symbol: string;
  description: string;
  tokenImageUrl: string;
  fundingRaised: bigint;
  tokenAddress: string;
  creatorAddress: string;
  isLiquidityCreated: boolean;
}

const BondingCurveProgress: React.FC<BondingCurveProgressProps> = ({
  currentSupply,
  tokenSymbol,
  currentPrice,
  tokenAddress,
}) => {
  const { data: walletClient } = useWalletClient();
  const [token, setToken] = useState<MemeToken | null>(null);
  const [currentLiquidity, setCurrentLiquidity] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(true);
  const [isClaimingReward, setIsClaimingReward] = useState(false);

  // Constants
  const maxSupply = ethers.parseEther("1000");
  const initialSupply = ethers.parseEther("200");
  const availableSupply = maxSupply - initialSupply;

  const handleClaimReward = async () => {
    if (!walletClient || !tokenAddress || !token) return;

    try {
      setIsClaimingReward(true);
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.TOKEN_FACTORY,
        TokenFactoryABI,
        signer
      );

      // Call the contract method to claim liquidity rewards
      const tx = await contract.claimReward(tokenAddress);
      await tx.wait();

      // Refresh token data after claiming
      const tokenData = await contract.addressToMemeTokenMapping(tokenAddress);
      setToken({
        name: tokenData[0],
        symbol: tokenData[1],
        description: tokenData[2],
        tokenImageUrl: tokenData[3],
        fundingRaised: tokenData[4],
        tokenAddress: tokenData[5],
        creatorAddress: tokenData[6],
        isLiquidityCreated: tokenData[7],
      });
    } catch (error) {
      console.error("Error claiming reward:", error);
    } finally {
      setIsClaimingReward(false);
    }
  };

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!walletClient || !tokenAddress) return;

      try {
        setIsLoading(true);
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESSES.TOKEN_FACTORY,
          TokenFactoryABI,
          signer
        );

        const tokenData = await contract.addressToMemeTokenMapping(
          tokenAddress
        );

        const data: MemeToken = {
          name: tokenData[0],
          symbol: tokenData[1],
          description: tokenData[2],
          tokenImageUrl: tokenData[3],
          fundingRaised: tokenData[4],
          tokenAddress: tokenData[5],
          creatorAddress: tokenData[6],
          isLiquidityCreated: tokenData[7],
        };

        setToken(data);
        setCurrentLiquidity(data.fundingRaised);
      } catch (error) {
        console.error("Error fetching token details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenDetails();
  }, [walletClient, tokenAddress]);

  // Calculate metrics
  const soldSupply =
    currentSupply > initialSupply ? currentSupply - initialSupply : BigInt(0);
  const progress = Number(
    (soldSupply * BigInt(10000)) / availableSupply / BigInt(100)
  );
  const availableTokens = ethers.formatEther(availableSupply - soldSupply);
  const metrics = getBondingCurveMetrics(currentSupply);
  const targetLiquidity = ethers.formatEther(
    BigInt(calculatePurchaseCost(currentSupply, availableSupply - soldSupply))
  );

  const isFullyLiquidated = Number(availableTokens) === 0;

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-2 bg-white/10 rounded-full w-full"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">Bonding Curve Progress</h2>
      <div className="space-y-4">
        <div className="w-full bg-black/20 rounded-full h-2">
          <div
            className="bg-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <div className="text-sm text-gray-400 space-y-2">
          <div className="flex justify-between items-center mb-2">
            <span>Progress</span>
            <span className="font-medium text-purple-400">
              {progress.toFixed(2)}%
            </span>
          </div>
          <div className="bg-black/20 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span>Available Tokens</span>
              <span className="font-medium">
                {Number(availableTokens).toFixed(2)} {tokenSymbol}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Current Liquidity</span>
              <span className="font-medium">
                {ethers.formatEther(currentLiquidity)} AVAX
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Target Liquidity</span>
              <span className="font-medium">
                {Number(targetLiquidity).toFixed(4)} AVAX
              </span>
            </div>
          </div>

          {isFullyLiquidated && token && !token.isLiquidityCreated && (
            <div className="mt-4 bg-purple-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-purple-400" />
                  <span className="font-medium text-purple-400">
                    Liquidity Pool Ready
                  </span>
                </div>
                <button
                  onClick={handleClaimReward}
                  disabled={isClaimingReward}
                  className="px-4 py-2 bg-purple-500 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClaimingReward ? "Claiming..." : "Claim Reward"}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                All tokens have been sold. You can now claim your liquidity
                provider rewards and the tokens will be automatically added to
                the liquidity pool.
              </p>
            </div>
          )}

          {!isFullyLiquidated && (
            <p className="mt-4 text-xs">
              When the target liquidity is reached, all liquidity from the
              bonding curve will be automatically deposited into the liquidity
              pool and the remaining tokens will be burned.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BondingCurveProgress;
