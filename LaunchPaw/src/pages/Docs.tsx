import React from "react";
import { Book, Shield, Rocket, Coins } from "lucide-react";
import Chatbot from "../components/ChatBot";

const Docs = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
          Documentation
        </h1>
        <p className="text-gray-400">Learn how to use the MemeVerse platform</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white/5 backdrop-blur-md rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Rocket className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-semibold">Getting Started</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">
              MemeVerse is a decentralized platform for launching and trading
              meme tokens on MemeSubnet. Follow these steps to get started:
            </p>
            <ol className="list-decimal list-inside space-y-4 text-gray-300">
              <li>Connect your wallet to the MemeSubnet network</li>
              <li>Ensure you have AVAX for gas fees and trading</li>
              <li>Navigate to the Launch page to create your token</li>
              <li>Or visit the Trade page to start trading existing tokens</li>
            </ol>
          </div>
        </section>

        <section className="bg-white/5 backdrop-blur-md rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-semibold">Security Features</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">
              Our platform includes several security features to protect users:
            </p>
            <ul className="list-disc list-inside space-y-4 text-gray-300">
              <li>Anti-bot protection during token launches</li>
              <li>Automated liquidity locking</li>
              <li>Contract verification and audit requirements</li>
              <li>Maximum transaction and wallet limits</li>
            </ul>
          </div>
        </section>

        <section className="bg-white/5 backdrop-blur-md rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Coins className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-semibold">Trading Guide</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">
              Learn how to trade tokens effectively on our platform:
            </p>
            <ul className="list-disc list-inside space-y-4 text-gray-300">
              <li>Use the Trade page to swap tokens</li>
              <li>Monitor token performance in Rankings</li>
              <li>Track your portfolio in Dashboard</li>
              <li>Earn rewards by providing liquidity</li>
            </ul>
          </div>
        </section>

        <section className="bg-white/5 backdrop-blur-md rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Book className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-semibold">FAQ</h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">
                How do I create a token?
              </h3>
              <p className="text-gray-300">
                Visit the Launch page, fill in your token details, and follow
                the guided process. You'll need AVAX for deployment and initial
                liquidity.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">What are the fees?</h3>
              <p className="text-gray-300">
                Trading fees are 0.3%, with 0.25% going to liquidity providers
                and 0.05% to the platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                How do I earn rewards?
              </h3>
              <p className="text-gray-300">
                Provide liquidity to earn a share of trading fees, or
                participate in token launches to earn launch rewards.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Chatbot />
    </div>
  );
};

export default Docs;
