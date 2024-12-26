"use client";
import { motion } from "framer-motion";
import { Card } from "../../components/Card";


interface Transaction {
  type: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: string;
  gasUsed: string;
}

export const TransactionDetails = ({
  transaction,
}: {
  transaction: Transaction;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="mb-12"
  >
    <Card title="Transaction Details" className="max-w-4xl mx-auto" children={undefined}>
      {/* Rest of the TransactionDetails component remains the same... */}
    </Card>
  </motion.div>
);
