"use client";
import React, { useEffect, useState } from "react";
import {
  Wallet,
  History,
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
import Chatbot from "../components/ChatBot";

interface LaunchPawToken {
  name: string;
  symbol: string;
  description: string;
  tokenImageUrl: string;
  fundingRaised: bigint;
  tokenAddress: string;
  creatorAddress: string;
  isLiquidityCreated: boolean;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  timestamp: number;
  tokenName?: string;
  tokenSymbol?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [launchedTokens, setLaunchedTokens] = useState<LaunchPawToken[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Get all tokens
        const allTokens = await contract.getAllTokens();
        const tokens: LaunchPawToken[] = [];

        for (const tokenAddress of allTokens) {
          const tokenInfo = await contract.getTokenInfo(tokenAddress);
          tokens.push({
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            description: tokenInfo.description,
            tokenImageUrl: "", // Not using image URLs for now
            fundingRaised: tokenInfo.currentFunding,
            tokenAddress: tokenAddress,
            creatorAddress: tokenInfo.creator,
            isLiquidityCreated: tokenInfo.isLaunched
          });
        }

        // Filter tokens created by the current user
        const userTokens = tokens.filter(
          (token) => token.creatorAddress.toLowerCase() === address.toLowerCase()
        );
        setLaunchedTokens(userTokens);

        // Fetch recent transactions
        const latestBlock = await provider.getBlockNumber();
        const fetchCount = 10; // Last 10 blocks
        const transactions: Transaction[] = [];

        for (let i = 0; i < fetchCount; i++) {
          const block = await provider.getBlock(latestBlock - i, true);
          if (block && block.transactions) {
            for (const tx of block.transactions) {
              if (typeof tx === 'string') continue;
              const transaction = tx as ethers.TransactionResponse;
              if (transaction.from.toLowerCase() === address.toLowerCase() || 
                  transaction.to?.toLowerCase() === address.toLowerCase()) {
                transactions.push({
                  hash: transaction.hash,
                  from: transaction.from,
                  to: transaction.to || '',
                  value: transaction.value,
                  timestamp: block.timestamp
                });
              }
            }
          }
        }

        setRecentTransactions(transactions);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaunchedTokens();
  }, [address, isConnected, walletClient]);

  const formatValue = (value: bigint): string => {
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

      {/* Stats Grid */}
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
                (acc, token) => acc + Number(formatValue(token.fundingRaised)),
                0
              )
              .toFixed(4)}{" "}
            EDU
          </div>
          <p className="text-sm text-gray-400 mt-1">Combined liquidity</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Launched Tokens */}
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
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Rocket className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium">{token.name}</div>
                      <div className="text-sm text-gray-400">
                        {formatValue(token.fundingRaised)} EDU raised
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

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6">
          <Card title="Recent Activity" className="sticky top-24">
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {recentTransactions.map((tx) => (
                <div key={tx.hash} className="transaction-item">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        {tx.from.toLowerCase() === address?.toLowerCase() ? (
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-red-400"
                          >
                            ↑
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="text-green-400"
                          >
                            ↓
                          </motion.div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {tx.from.toLowerCase() === address?.toLowerCase()
                            ? "Sent"
                            : "Received"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {formatValue(tx.value)} EDU
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(tx.timestamp * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No recent activity</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      <BasicWallet />
      <Chatbot />
    </div>
  );
};

export default Dashboard;