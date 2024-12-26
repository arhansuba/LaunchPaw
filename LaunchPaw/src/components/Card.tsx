"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const Card = ({ title, children, className = "" }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`glass-card overflow-hidden ${className}`}
  >
    <div className="p-4 border-b border-white/20">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="p-4">{children}</div>
  </motion.div>
);
