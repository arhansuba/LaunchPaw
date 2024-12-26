"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { Card } from "../../components/Card";

interface Block {
  number: number;
  hash: string;
  timestamp: number;
  transactions: string[];
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

export const RecentBlocks = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const latestBlockResponse = await fetch('https://api.blockcypher.com/v1/eth/main');
        const latestBlockData = await latestBlockResponse.json();
        const latestBlock = latestBlockData.height;

        const blockPromises = [];
        for (let i = 0; i < 10; i++) {
          if (latestBlock - i >= 0) {
            blockPromises.push(fetchBlock(latestBlock - i));
          }
        }

        const blocks = await Promise.all(blockPromises);
        setBlocks(blocks.filter((block): block is Block => block !== null));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blocks:', error);
        setIsLoading(false);
      }
    };

    fetchBlocks();

    const interval = setInterval(fetchBlocks, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card title="Recent Blocks" className="h-full">
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <motion.div
              className="w-8 h-8 border-4 border-primary-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          blocks.map((block, index) => (
            <motion.div
              key={block.hash}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    Block #{block.number}
                  </h3>
                  <p className="text-sm text-white/60">
                    {new Date(block.timestamp * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">
                    {block.transactions.length} transactions
                  </p>
                  <p className="text-xs text-white/40 font-mono truncate w-32">
                    {block.hash}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
};