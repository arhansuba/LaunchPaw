"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { ethers } from "ethers";
import { Card } from "../components/Card";
import Chatbot from "../components/ChatBot";

// Standard ERC20 ABI for balanceOf and decimals functions
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

interface TokenBalance {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
}

export default function BalanceApp() {
  const [address, setAddress] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Common token addresses on EduChain testnet (to be replaced with actual addresses)
  const COMMON_TOKENS = [
    "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
  ];

  const handleSetAddress = async () => {
    const addressPattern = /^0x[a-fA-F0-9]{40}$/;

    if (!addressPattern.test(inputValue)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    setError("");
    setAddress(inputValue);
    setIsLoading(true);

    try {
      const balances = await fetchTokenBalances(inputValue);
      setBalances(balances);
    } catch (err) {
      setError("Failed to fetch balances");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTokenBalances = async (address: string): Promise<TokenBalance[]> => {
    // Connect to EduChain network
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    const balances: TokenBalance[] = [];
    
    for (const tokenAddress of COMMON_TOKENS) {
      try {
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, await provider.getSigner());
        
        const [balance, decimals, symbol, name] = await Promise.all([
          tokenContract.balanceOf(address),
          tokenContract.decimals(),
          tokenContract.symbol(),
          tokenContract.name()
        ]);

        if (balance.gt(0)) {
          balances.push({
            address: tokenAddress,
            name,
            symbol,
            decimals,
            balance: balance.toString()
          });
        }
      } catch (error) {
        console.error(`Error fetching balance for token ${tokenAddress}:`, error);
      }
    }
    
    return balances;
  };

  const LoadingSpinner = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="relative w-24 h-24">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-t-primary-300 border-r-primary-400 border-b-primary-500 border-l-primary-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-4 border-t-secondary-300 border-r-secondary-400 border-b-secondary-500 border-l-secondary-600"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-4 border-t-primary-400 border-r-primary-500 border-b-primary-600 border-l-primary-300"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <motion.p
        className="mt-8 text-lg text-white/60"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Fetching token balances...
      </motion.p>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Token Balance Explorer
        </h1>
        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
          View token balances for any address on EduChain
        </p>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card p-8">
            <div className="relative mb-6">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="glass-input text-lg"
                placeholder="Enter wallet address (0x...)"
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mb-4"
              >
                {error}
              </motion.p>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSetAddress}
              className="glass-button w-full text-lg py-3"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "View Balances"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {balances.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {balances.map((token, index) => (
                <motion.div
                  key={token.address}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="token-card group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <span className="text-xl font-bold text-white/30">
                        {token.symbol[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary-300 transition-colors">
                        {token.name}
                      </h3>
                      <p className="text-sm text-white/60">{token.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary-300">
                        {(
                          Number(token.balance) /
                          10 ** token.decimals
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                      </p>
                      <span className="text-xs text-white/40">
                        {token.symbol}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {address && balances.length === 0 && !isLoading && (
            <Card
              title="No Tokens Found"
              className="max-w-xl mx-auto text-center p-8"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-white/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg text-white/60">
                  This address doesn't have any token balances yet.
                </p>
              </div>
            </Card>
          )}
        </>
      )}
      <Chatbot />
    </div>
  );
}