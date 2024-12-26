"use client";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { Droplets, AlertCircle } from "lucide-react";
import { FaucetABI } from "../abi/FaucetABI";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import WalletButton from "../components/WalletButton";
import { useWalletClient } from "wagmi";
import Chatbot from "../components/ChatBot";

const Faucet = () => {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receiverAddress, setReceiverAddress] = useState("");
  const { data: walletClient } = useWalletClient();

  const handleClaim = async () => {
    if (!isConnected || !walletClient) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const targetAddress = receiverAddress || address;
      
      if (!targetAddress) {
        setError("No target address specified");
        return;
      }

      console.log("Claiming tokens for address:", targetAddress);
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.FAUCET,
        FaucetABI,
        signer
      );

      const tx = await contract.claimTokens(targetAddress, {
        gasLimit: 1000000,
      });
      await tx.wait();
      console.log("Transaction mined:", tx);

      // Clear receiver address after successful claim
      setReceiverAddress("");
      
      // Show success message
      alert("Successfully claimed EDU tokens!");
    } catch (err: any) {
      console.error("Error claiming tokens:", err);
      if (err.message?.includes("daily limit")) {
        setError("You've reached the daily claim limit. Please try again tomorrow.");
      } else {
        setError("Failed to claim tokens. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          LaunchPaw Faucet
        </h1>
        <p className="text-gray-400">
          Get test EDU tokens to start creating and trading tokens
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8">
        {!isConnected ? (
          <div className="text-center">
            <Droplets className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Connect your wallet to claim test EDU tokens
            </p>
            <WalletButton />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-xl">
              <div className="flex items-center space-x-3">
                <Droplets className="h-6 w-6 text-purple-400" />
                <div>
                  <h3 className="font-medium">Available Amount</h3>
                  <p className="text-sm text-gray-400">1 EDU per claim</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">1.0</p>
                <p className="text-sm text-gray-400">EDU</p>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="receiver"
                className="block text-sm font-medium text-gray-200"
              >
                Receiver Address (optional)
              </label>
              <input
                type="text"
                id="receiver"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Enter receiver address or leave empty to use your address"
                className="w-full px-4 py-2 bg-black/20 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400">
                Leave empty to use your connected wallet address
              </p>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-4 rounded-xl">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={handleClaim}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Claiming..." : "Claim EDU"}
            </button>

            <p className="text-sm text-gray-400 text-center">
              Claim 1 EDU token to get started with LaunchPaw
            </p>
          </div>
        )}
      </div>
      <Chatbot />
    </div>
  );
};

export default Faucet;