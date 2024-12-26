"use client";
import { ReactNode, MouseEventHandler } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export const Button = ({ children, onClick, className = '' }: ButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`glass-button ${className}`}
  >
    {children}
  </motion.button>
);