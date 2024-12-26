"use client";
import { motion } from "framer-motion";
import { Card } from "../../components/Card";
import { EvmBlock } from "@avalabs/avacloud-sdk/models/components";

export const RecentBlocks = ({ blocks }: { blocks: EvmBlock[] }) => (
  <Card title="Recent Blocks" className="h-full">
    {/* Add children content here */}
    {/* Rest of the RecentBlocks component remains the same... */}
  </Card>
);
