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
        <p className="text-gray-400">Learn how to use the LaunchPaw platform</p>
      </div>

      <div className="space-y-8">
        <section className="bg-white/5 backdrop-blur-md rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Rocket className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-semibold">Getting Started</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">
              LaunchPaw is a decentralized platform for launching and managing tokens 
              on EduChain. Here's how to get started:
            </p>
            <ol className="list-decimal list-inside space-y-4 text-gray-300">
              <li>Connect your wallet to the EduChain network</li>
              <li>Get test EDU tokens from our faucet for gas fees</li>
              <li>Use the Launch page to create your token</li>
              <li>Visit the Trade page to participate in token trading</li>
            </ol>
          </div>
        </section>

        <section className="bg-white/5 backdrop-blur-md rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-6 w-6 text-purple-400" />
            <h2 className="text-2xl font-semibold">Platform Features</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">
              Our platform includes several key features:
            </p>
            <ul className="list-disc list-inside space-y-4 text-gray-300">
              <li>Automated bonding curve for fair token distribution</li>
              <li>Built-in liquidity pool management</li>
              <li>Smart contract verification system</li>
              <li>Customizable token parameters</li>
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
              Understanding how token trading works on LaunchPaw:
            </p>
            <ul className="list-disc list-inside space-y-4 text-gray-300">
              <li>Use the Trade page for token swaps</li>
              <li>Track token performance in the Rankings section</li>
              <li>View your holdings in the Dashboard</li>
              <li>Participate in liquidity pools for rewards</li>
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
                Visit the Launch page and follow our step-by-step process. You'll need EDU 
                tokens for deployment and initial liquidity. Our bonding curve mechanism 
                ensures fair token distribution.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                What are the platform mechanics?
              </h3>
              <p className="text-gray-300">
                LaunchPaw uses a bonding curve mechanism for token pricing, automated 
                liquidity pools, and a reward system for early supporters. Trading fees 
                are set at 0.3% to maintain liquidity.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                How do I participate in token launches?
              </h3>
              <p className="text-gray-300">
                Browse available tokens in the Marketplace, use EDU tokens to participate 
                in launches, and track your investments in the Dashboard. Early supporters 
                receive additional benefits through our bonding curve mechanism.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">
                Is this platform secure?
              </h3>
              <p className="text-gray-300">
                Yes, our platform runs on EduChain with audited smart contracts, automated 
                liquidity management, and transparent token mechanics. All contract code 
                is verified and open source.
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