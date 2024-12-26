"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import Chatbot from "../components/ChatBot";

interface Block {
  number: number;
  hash: string;
  timestamp: number;
  transactions: string[];
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timestamp: number;
}

interface SelectedItem {
  type: string;
  id: string;
  from: string;
  to: string;
  value: string;
}

const fetchBlock = async (blockNumber: number): Promise<Block | null> => {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/eth/main/blocks/${blockNumber}`);
    const data = await response.json();
    return {
      number: data.height,
      hash: data.hash,
      timestamp: data.time,
      transactions: data.txids,
    };
  } catch (error) {
    console.error('Error fetching block:', error);
    return null;
  }
};

const fetchTransaction = async (txHash: string): Promise<Transaction | null> => {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/eth/main/txs/${txHash}`);
    const data = await response.json();
    return {
      hash: data.hash,
      from: data.inputs[0].addresses[0],
      to: data.outputs[0].addresses[0],
      value: data.total,
      blockNumber: data.block_height,
      timestamp: data.confirmed,
    };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
};

export default function BlockchainExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [recentBlocks, setRecentBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const validateAddress = (address: string): boolean => {
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    return addressRegex.test(address);
  };

  const validateTxHash = (hash: string): boolean => {
    const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
    return txHashRegex.test(hash);
  };

  const validateBlockNumber = (block: string): boolean => {
    const blockRegex = /^\d+$/;
    return blockRegex.test(block);
  };

  const fetchRecentData = async () => {
    try {
      const latestBlockResponse = await fetch('https://api.blockcypher.com/v1/eth/main');
      const latestBlockData = await latestBlockResponse.json();
      const latestBlock = latestBlockData.height;

      // Fetch recent blocks
      const blockPromises = [];
      for (let i = 0; i < 10; i++) {
        if (latestBlock - i >= 0) {
          blockPromises.push(fetchBlock(latestBlock - i));
        }
      }
      const blocks = await Promise.all(blockPromises);

      // Process blocks and transactions
      const processedBlocks: Block[] = [];
      const processedTxs: Transaction[] = [];

      for (const block of blocks) {
        if (block) {
          processedBlocks.push(block);

          // Get transactions from this block
          const txPromises = block.transactions.map(fetchTransaction);
          const transactions = await Promise.all(txPromises);
          processedTxs.push(...transactions.filter((tx): tx is Transaction => tx !== null));
        }
      }

      setRecentBlocks(processedBlocks);
      setRecentTransactions(processedTxs.slice(0, 10));
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
    }
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
        const response = await fetch(`https://api.blockcypher.com/v1/eth/main/addrs/${searchTerm}/balance`);
        const data = await response.json();
        setSelectedItem({
          type: "address",
          id: searchTerm,
          from: "N/A",
          to: "N/A",
          value: `${(data.balance / 1e18).toFixed(4)} ETH`,
        });
      } else if (validateTxHash(searchTerm)) {
        const tx = await fetchTransaction(searchTerm);
        if (tx) {
          setSelectedItem({
            type: "transaction",
            id: searchTerm,
            from: tx.from,
            to: tx.to || 'Contract Creation',
            value: `${(parseInt(tx.value) / 1e18).toFixed(4)} ETH`,
          });
        } else {
          setSearchError("Transaction not found");
        }
      } else if (validateBlockNumber(searchTerm)) {
        const block = await fetchBlock(parseInt(searchTerm));
        if (block) {
          setSelectedItem({
            type: "block",
            id: searchTerm,
            from: "N/A",
            to: "N/A",
            value: `${block.transactions.length} transactions`,
          });
        } else {
          setSearchError("Block not found");
        }
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
    const init = async () => {
      setIsLoading(true);
      await fetchRecentData();
      setIsLoading(false);
    };

    init();
    const interval = setInterval(fetchRecentData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          EduChain Explorer
        </h1>
        <p className="text-xl text-white/60 mb-12">
          Monitor real-time blockchain activity
        </p>

        {/* Search Section */}
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
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Selected Item Details */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-12"
        >
          <Card title={`${selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)} Details`} 
                className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Details content */}
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <span className="text-white/60">
                  {selectedItem.type === "block" ? "Block Number" : "Hash"}
                </span>
                <span className="font-mono text-primary-300">{selectedItem.id}</span>
              </div>
              {selectedItem.type !== "block" && (
                <>
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <span className="text-white/60">From</span>
                    <span className="font-mono text-primary-300">{selectedItem.from}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                    <span className="text-white/60">To</span>
                    <span className="font-mono text-primary-300">{selectedItem.to}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                <span className="text-white/60">
                  {selectedItem.type === "block" ? "Transactions" : "Value"}
                </span>
                <span className="font-mono text-primary-300">{selectedItem.value}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recent Transactions and Blocks Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="mt-4 text-white/60">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card title="Recent Transactions">
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <motion.div
                    key={tx.hash}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="token-card group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium group-hover:text-primary-300 transition-colors">
                          {tx.hash.substring(0, 16)}...
                        </span>
                        <span className="text-xs text-white/60">
                          {Math.floor((Date.now() - new Date(tx.timestamp).getTime()) / 1000)}s ago
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-primary-300">
                          {(parseInt(tx.value) / 1e18).toFixed(4)} ETH
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Blocks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card title="Recent Blocks">
              <div className="space-y-4">
                {recentBlocks.map((block) => (
                  <motion.div
                    key={block.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="token-card group"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium group-hover:text-primary-300 transition-colors">
                          Block #{block.number}
                        </span>
                        <span className="text-xs text-white/60">
                          {Math.floor((Date.now() - new Date(block.timestamp).getTime()) / 1000)}s ago
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-primary-300">
                          {block.transactions.length} txs
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