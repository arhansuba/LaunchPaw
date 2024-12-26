"use client";
import { motion } from "framer-motion";
import { Card } from "../../components/Card";
import { NativeTransaction } from "@avalabs/avacloud-sdk/models/components";

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

export const RecentTransactions = ({
  transactions,
  onSelect,
}: {
  transactions: NativeTransaction[];
  onSelect: (tx: SelectedItem) => void;
}) => (
  <Card title="Recent Transactions" className="h-full">
    {/* Rest of the RecentTransactions component remains the same... */}
  </Card>
);
