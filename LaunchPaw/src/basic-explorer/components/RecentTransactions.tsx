"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { Card } from "../../components/Card";

interface SelectedItem {
  type: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: string;
  gasUsed: string;
}

interface TransactionWithExtras {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
  gasUsed: string;
}

const fetchTransaction = async (txHash: string): Promise<TransactionWithExtras | null> => {
  try {
    const response = await fetch(`https://api.blockcypher.com/v1/eth/main/txs/${txHash}`);
    const data = await response.json();
    return {
      hash: data.hash,
      from: data.inputs[0].addresses[0],
      to: data.outputs[0].addresses[0],
      value: data.total,
      timestamp: data.confirmed,
      blockNumber: data.block_height,
      gasUsed: data.gas_used,
    };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return null;
  }
};

export const RecentTransactions = ({
  onSelect,
}: {
  onSelect: (tx: SelectedItem) => void;
}) => {
  const [transactions, setTransactions] = useState<TransactionWithExtras[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const latestBlockResponse = await fetch('https://api.blockcypher.com/v1/eth/main');
        const latestBlockData = await latestBlockResponse.json();
        const latestBlock = latestBlockData.height;

        const blockResponse = await fetch(`https://api.blockcypher.com/v1/eth/main/blocks/${latestBlock}`);
        const blockData = await blockResponse.json();
        const txHashes = blockData.txids.slice(0, 10);

        const txPromises = txHashes.map(fetchTransaction);
        const transactions = await Promise.all(txPromises);
        setTransactions(transactions.filter((tx): tx is TransactionWithExtras => tx !== null));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setIsLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (tx: TransactionWithExtras) => {
    onSelect({
      type: 'transaction',
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: (parseInt(tx.value) / 1e18).toFixed(4),
      timestamp: tx.timestamp,
      blockNumber: tx.blockNumber.toString(),
      gasUsed: tx.gasUsed
    });
  };

  return (
    <Card title="Recent Transactions" className="h-full">
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
          transactions.map((tx, index) => (
            <motion.div
              key={tx.hash}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => handleClick(tx)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-mono text-white/60 truncate w-32">
                    {tx.hash}
                  </p>
                  <p className="text-xs text-white/40">
                    From: {tx.from.slice(0, 8)}...{tx.from.slice(-6)}
                  </p>
                  {tx.to && (
                    <p className="text-xs text-white/40">
                      To: {tx.to.slice(0, 8)}...{tx.to.slice(-6)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {(parseInt(tx.value) / 1e18).toFixed(4)} ETH
                  </p>
                  <p className="text-xs text-white/40">
                    Block #{tx.blockNumber}
                  </p>
                  <p className="text-xs text-white/40">
                    {new Date(tx.timestamp * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
        {!isLoading && transactions.length === 0 && (
          <div className="text-center py-8 text-white/60">
            No transactions found
          </div>
        )}
      </div>
    </Card>
  );
};