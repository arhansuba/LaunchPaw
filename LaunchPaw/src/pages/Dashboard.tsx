import React, { useEffect, useState } from "react";
import {
  Wallet,
  History,
  Award,
  ChevronRight,
  Rocket,
  Users,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { useAccount, useWalletClient } from "wagmi";
import { formatEther } from "viem";
import { TokenFactoryABI } from "../abi";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import BasicWallet from "../components/basic-wallet";
import {
  Erc1155TokenBalance,
  Erc20TokenBalance,
  TransactionDetails,
} from "@avalabs/avacloud-sdk/models/components";
import Chatbot from "../components/ChatBot";

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [launchedTokens, setLaunchedTokens] = useState<MemeToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] =
    useState<TransactionDetails>();

  useEffect(() => {
    const fetchLaunchedTokens = async () => {
      if (!walletClient || !isConnected || !address) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();

        const contract = new ethers.Contract(
          CONTRACT_ADDRESSES.TOKEN_FACTORY,
          TokenFactoryABI,
          signer
        );

        const tokenCount = await contract.getMemeTokenCount();
        const tokens: MemeToken[] = [];

        for (let i = 0; i < tokenCount; i++) {
          const memeToken = await contract.getMemeTokenByIndex(i);
          tokens.push({
            name: memeToken[0],
            symbol: memeToken[1],
            description: memeToken[2],
            tokenImageUrl: memeToken[3],
            fundingRaised: memeToken[4],
            tokenAddress: memeToken[5],
            creatorAddress: memeToken[6],
            isLiquidityCreated: memeToken[7],
          });
        }

        // Filter tokens created by the current user
        const userTokens = tokens.filter(
          (token) =>
            token.creatorAddress.toLowerCase() === address.toLowerCase()
        );
        setLaunchedTokens(userTokens);
      } catch (err) {
        console.error("Error fetching launched tokens:", err);
        setError("Failed to fetch tokens. Please try again later.");
        setLaunchedTokens([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaunchedTokens();
  }, [address, isConnected, walletClient]);

  const formatAvaxValue = (value: bigint): string => {
    return Number(formatEther(value)).toFixed(4);
  };

  const handleTokenClick = (tokenAddress: string) => {
    navigate(`/token/${tokenAddress}`);
  };

  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto text-center py-20">
        <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-8">
          Please connect your wallet to view your dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Dashboard
        </h1>
        <p className="text-gray-400">
          Manage your tokens and track your performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Rocket className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-medium">Launched Tokens</h3>
          </div>
          <div className="text-3xl font-bold">{launchedTokens.length}</div>
          <p className="text-sm text-gray-400 mt-1">Total tokens created</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-medium">Total Holders</h3>
          </div>
          <div className="text-3xl font-bold">-</div>
          <p className="text-sm text-gray-400 mt-1">Across all tokens</p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-medium">Total Value Locked</h3>
          </div>
          <div className="text-3xl font-bold">
            {launchedTokens
              .reduce(
                (acc, token) =>
                  acc + Number(formatAvaxValue(token.fundingRaised)),
                0
              )
              .toFixed(4)}{" "}
            AVAX
          </div>
          <p className="text-sm text-gray-400 mt-1">Combined liquidity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6">Your Launched Tokens</h2>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-purple-500/20 text-purple-400 rounded-full hover:bg-purple-500/30 transition"
              >
                Retry
              </button>
            </div>
          ) : launchedTokens.length > 0 ? (
            <div className="space-y-4">
              {launchedTokens.map((token) => (
                <div
                  key={token.tokenAddress}
                  onClick={() => handleTokenClick(token.tokenAddress)}
                  className="flex items-center justify-between p-4 bg-black/20 rounded-xl hover:bg-black/30 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    {token.tokenImageUrl ? (
                      <img
                        src={token.tokenImageUrl}
                        alt={token.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Rocket className="h-5 w-5 text-purple-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-gray-400">
                        {formatAvaxValue(token.fundingRaised)} AVAX raised
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        token.isLiquidityCreated
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {token.isLiquidityCreated ? "Live" : "Pending"}
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Rocket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No tokens launched yet</p>
              <Link
                to="/launch"
                className="mt-4 inline-block px-6 py-2 bg-purple-500/20 text-purple-400 rounded-full hover:bg-purple-500/30 transition"
              >
                Launch Your First Token
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
          <div className="space-y-4">
            <Card title="Recent Activity" className="sticky top-24">
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {"nfts" === "nfts" &&
                  recentTransactions?.erc721Transfers?.map((tx) => (
                    <div key={tx.logIndex} className="transaction-item">
                      <div className="flex items-center gap-4">
                        {tx.erc721Token.metadata.imageUri && (
                          <img
                            src={tx.erc721Token.metadata.imageUri}
                            alt={tx.erc721Token.name}
                            className="w-12 h-12 rounded-lg"
                          />
                        )}
                        <div>
                          <p className="text-sm font-semibold">
                            {String(tx.from?.address) === address
                              ? "Sent"
                              : "Received"}
                          </p>
                          <p className="text-xs text-white/60">
                            {tx.erc721Token.name} #{tx.erc721Token.tokenId}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                {"erc20" === "erc20" &&
                  recentTransactions?.erc20Transfers?.map((tx) => (
                    <div key={tx.logIndex} className="transaction-item">
                      <div className="flex items-center gap-4">
                        {tx.erc20Token.logoUri && (
                          <img
                            src={tx.erc20Token.logoUri}
                            alt={tx.erc20Token.name}
                            className="w-12 h-12 rounded-full"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold">
                            {String(tx.from?.address) === address
                              ? "Sent"
                              : "Received"}
                          </p>
                          <p className="text-xs text-white/60">
                            {(
                              Number(tx.value) /
                              10 ** Number(tx.erc20Token.decimals)
                            ).toLocaleString()}{" "}
                            {tx.erc20Token.symbol}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <BasicWallet />
      <Chatbot />
    </div>
  );
};

export default Dashboard;
