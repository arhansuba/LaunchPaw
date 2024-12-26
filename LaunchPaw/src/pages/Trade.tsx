import React, { useState } from "react";
import { ArrowDownUp, Info } from "lucide-react";
import { ethers } from "ethers";
import { TokenFactoryABI, NativeLiquidityPoolABI } from "../abi";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import Chatbot from "../components/ChatBot";

const Trade = () => {
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapType, setSwapType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("");

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedToken) return;

    setIsSwapping(true);
    try {
      // Contract interaction logic will go here
      console.log("Swapping:", { amount, selectedToken, type: swapType });
    } catch (error) {
      console.error("Swap error:", error);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Trade Meme Tokens
        </h1>
        <p className="text-gray-400">
          Swap tokens instantly with our native liquidity pools
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Swap</h2>
            <div className="group relative">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64">
                Trade tokens instantly using our automated liquidity pools
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          </div>
          <button
            onClick={() => setSwapType(swapType === "buy" ? "sell" : "buy")}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowDownUp className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSwap} className="space-y-6">
          <div className="space-y-4">
            <div className="bg-black/20 rounded-xl p-4">
              <label className="block text-sm text-gray-400 mb-2">
                You {swapType === "buy" ? "pay" : "sell"}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="flex-1 bg-transparent text-2xl outline-none"
                />
                <span className="text-lg font-medium">
                  {swapType === "buy" ? "AVAX" : "TOKEN"}
                </span>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-4">
              <label className="block text-sm text-gray-400 mb-2">
                You {swapType === "buy" ? "receive" : "get"}
              </label>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  className="flex-1 bg-transparent text-2xl outline-none"
                >
                  <option value="">Select token</option>
                  {/* Token list will be populated from contract */}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/20 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price Impact</span>
              <span className="text-purple-400">{"< 0.1%"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Liquidity Provider Fee</span>
              <span className="text-purple-400">0.3%</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSwapping || !amount || !selectedToken}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSwapping
              ? "Swapping..."
              : `Swap ${
                  swapType === "buy" ? "AVAX for Tokens" : "Tokens for AVAX"
                }`}
          </button>
        </form>
      </div>

      <div className="mt-8 bg-white/5 backdrop-blur-md rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
        <div className="space-y-4">
          {/* Placeholder for recent trades */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">No recent trades</span>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Trade;
