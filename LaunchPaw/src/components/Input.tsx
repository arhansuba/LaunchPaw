"use client";
import React, { ChangeEvent } from 'react';
import { motion } from 'framer-motion';

interface InputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ value, onChange, placeholder, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`glass-input ${className}`}
    />
  </motion.div>
);