"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Erc20TokenBalance } from "@avalabs/avacloud-sdk/models/components/erc20tokenbalance";
import { Card } from "../components/Card";
import { AvaCloudSDK } from "@avalabs/avacloud-sdk";
import { get } from "http";
import { li } from "framer-motion/client";
import Chatbot from "../components/ChatBot";

const avaCloudSDK = new AvaCloudSDK({
  apiKey: import.meta.env.VITE_AVACLOUD_API_KEY,
  chainId: "43114",
  network: "mainnet",
});

export default function BalanceApp() {
  const [address, setAddress] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [balances, setBalances] = useState<Erc20TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function getBlockHeight() {
    console.log("getBlockHeight started");
    const result = await avaCloudSDK.data.evm.blocks.getLatestBlocks({
      pageSize: 1,
    });
    return result.result.blocks[0].blockNumber;
  }

  async function listErc20Balances(address: string, blockNumber: string) {
    const result = await avaCloudSDK.data.evm.balances.listErc20Balances({
      blockNumber: blockNumber,
      pageSize: 10,
      address: address,
    });
    const balances: Erc20TokenBalance[] = [];
    for await (const page of result) {
      balances.push(...page.result.erc20TokenBalances);
    }
    return balances;
  }

  const handleSetAddress = async () => {
    const addressPattern = /^0x[a-fA-F0-9]{40}$/;

    if (!addressPattern.test(inputValue)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    setError("");
    setAddress(inputValue);
    console.log("Input value", inputValue);
    setIsLoading(true);

    try {
      const balances = await fetchERC20Balances(inputValue);
      console.log("balances", balances);
      setBalances(balances);
    } catch (err) {
      setError("Failed to fetch balances");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchERC20Balances = async (address: string) => {
    console.log("Blockresult started");
    const blockNumber = await getBlockHeight();
    console.log("blockResult", blockNumber);
    const balanceResult = await listErc20Balances(address, blockNumber);
    console.log("balanceResult", balanceResult);
    const balances = balanceResult.map((balance) => {
      return {
        address: balance.address,
        name: balance.name,
        symbol: balance.symbol,
        decimals: balance.decimals,
        balance: balance.balance,
        logoUri: balance.logoUri,
      };
    });
    return balances as Erc20TokenBalance[];
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
      <motion.div
        className="mt-4 flex gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-2 h-2 rounded-full bg-primary-300 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse delay-100" />
        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse delay-200" />
      </motion.div>
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
          View token balances for any address on the network
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
                    {token.logoUri ? (
                      <img
                        src={token.logoUri}
                        alt={token.name}
                        className="w-12 h-12 rounded-full bg-white/5 p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <span className="text-xl font-bold text-white/30">
                          {token.symbol?.[0]}
                        </span>
                      </div>
                    )}
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
                          10 ** Number(token.decimals)
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 4,
                        })}
                      </p>
                      <a
                        href={`https://snowtrace.io/token/${token.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/40 hover:text-white/60 transition-colors inline-flex items-center gap-1"
                      >
                        View Contract
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </a>
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
