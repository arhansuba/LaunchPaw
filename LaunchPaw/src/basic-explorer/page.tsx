"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import {
  NativeTransaction,
  EvmBlock,
} from "@avalabs/avacloud-sdk/models/components";
import Chatbot from "../components/ChatBot";

import { AvaCloudSDK } from "@avalabs/avacloud-sdk";
const avaCloudSDK = new AvaCloudSDK({
  apiKey: import.meta.env.VITE_AVACLOUD_API_KEY,
  chainId: "43114",
  network: "mainnet",
});

export default function BlockchainExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<
    NativeTransaction[]
  >([]);
  const [recentBlocks, setRecentBlocks] = useState<EvmBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  interface SelectedItem {
    type: string;
    id: string;
    from: string;
    to: string;
    value: string;
  }

  const validateAddress = (address: string): boolean => {
    // Check if it's a valid hex address
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    return addressRegex.test(address);
  };

  const validateTxHash = (hash: string): boolean => {
    // Check if it's a valid transaction hash
    const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
    return txHashRegex.test(hash);
  };

  const validateBlockNumber = (block: string): boolean => {
    // Check if it's a valid block number
    const blockRegex = /^\d+$/;
    return blockRegex.test(block);
  };

  const getRecentBlocks = async () => {
    const result = await avaCloudSDK.data.evm.blocks.getLatestBlocks({
      pageSize: 10,
    });
    const blocks: EvmBlock[] = [];
    for await (const page of result) {
      blocks.push(...page.result.blocks);
      if (blocks.length >= 10) break;
    }
    return blocks;
  };

  const getRecentTransactions = async () => {
    const result =
      await avaCloudSDK.data.evm.transactions.listLatestTransactions({
        pageSize: 10,
      });
    const transactions: NativeTransaction[] = [];
    for await (const page of result) {
      transactions.push(...page.result.transactions);
      if (transactions.length >= 10) break;
    }
    return transactions;
  };

  const fetchRecentTransactions = async () => {
    const result = await getRecentTransactions();
    return result as NativeTransaction[];
  };

  const fetchRecentBlocks = async () => {
    const result = await getRecentBlocks();
    return result as EvmBlock[];
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchError("Please enter a search term");
      return;
    }

    setSearchError("");
    setIsSearching(true);

    try {
      if (validateAddress(searchTerm)) {
        // Handle address search
        setSelectedItem({
          type: "address",
          id: searchTerm,
          from: "N/A",
          to: "N/A",
          value: "Loading...",
        });
      } else if (validateTxHash(searchTerm)) {
        // Handle transaction hash search
        setSelectedItem({
          type: "transaction",
          id: searchTerm,
          from: "0xMockSender",
          to: "0xMockReceiver",
          value: "1.5 AVAX",
        });
      } else if (validateBlockNumber(searchTerm)) {
        // Handle block number search
        setSelectedItem({
          type: "block",
          id: searchTerm,
          from: "N/A",
          to: "N/A",
          value: `Block #${searchTerm}`,
        });
      } else {
        setSearchError(
          "Invalid search format. Please enter a valid address, transaction hash, or block number"
        );
        setSelectedItem(null);
      }
    } catch (error) {
      setSearchError("An error occurred while searching. Please try again.");
      setSelectedItem(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [transactions, blocks] = await Promise.all([
          fetchRecentTransactions(),
          fetchRecentBlocks(),
        ]);
        setRecentTransactions(transactions);
        setRecentBlocks(blocks);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Blockchain Explorer
        </h1>
        <p className="text-xl text-white/60 mb-12">
          Monitor real-time blockchain activity
        </p>

        <motion.div
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card p-8">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className="glass-input text-lg flex-grow"
                  placeholder="Search by transaction, block, or address"
                  disabled={isSearching}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSearch}
                  className="glass-button px-8 text-lg"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <motion.div
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    "Search"
                  )}
                </motion.button>
              </div>
              {searchError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-left"
                >
                  {searchError}
                </motion.p>
              )}
              <div className="text-xs text-white/40 text-left">
                <p>Valid formats:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Address: 0x... (40 characters)</li>
                  <li>Transaction: 0x... (64 characters)</li>
                  <li>Block: number</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {selectedItem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-12"
        >
          <Card
            title={`${
              selectedItem.type.charAt(0).toUpperCase() +
              selectedItem.type.slice(1)
            } Details`}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <span className="text-white/60">
                  {selectedItem.type === "block" ? "Block Number" : "Hash"}
                </span>
                <span className="font-mono text-primary-300">
                  {selectedItem.id}
                </span>
              </div>
              {selectedItem.type !== "block" && (
                <>
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <span className="text-white/60">From</span>
                    <span className="font-mono text-primary-300">
                      {selectedItem.from}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <span className="text-white/60">To</span>
                    <span className="font-mono text-primary-300">
                      {selectedItem.to}
                    </span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <span className="text-white/60">
                  {selectedItem.type === "block" ? "Transactions" : "Value"}
                </span>
                <span className="font-mono text-primary-300">
                  {selectedItem.value}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            className="relative w-24 h-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
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
          </motion.div>
          <motion.p
            className="mt-8 text-lg text-white/60"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading blockchain data...
          </motion.p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card title="Recent Transactions">
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <motion.div
                    key={tx.txHash}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="token-card group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium group-hover:text-primary-300 transition-colors">
                          {tx.txHash.substring(0, 16)}...
                        </span>
                        <span className="text-xs text-white/60">
                          {Math.floor(
                            (Date.now() - tx.blockTimestamp * 1000) / 1000
                          )}
                          s ago
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-primary-300">
                          {(Number(tx.value) / 1e18).toFixed(4)} AVAX
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card title="Recent Blocks">
              <div className="space-y-4">
                {recentBlocks.map((block) => (
                  <motion.div
                    key={block.blockNumber}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="token-card group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium group-hover:text-primary-300 transition-colors">
                          Block #{block.blockNumber}
                        </span>
                        <span className="text-xs text-white/60">
                          {Math.floor(
                            (Date.now() - block.blockTimestamp * 1000) / 1000
                          )}
                          s ago
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-primary-300">
                          {block.txCount} txs
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      )}
      <Chatbot />
    </div>
  );
}
