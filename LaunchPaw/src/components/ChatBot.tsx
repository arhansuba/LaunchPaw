"use client";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Send } from "lucide-react";
import ChatMessage from "./ChatMessage";

interface Message {
  text: string;
  isBot: boolean;
}

const PRESET_RESPONSES = {
  default: "I'm here to help you with token launches and blockchain interactions. How can I assist you?",
  token: "To create a new token, you'll need to:\n1. Connect your wallet\n2. Fill in token details (name, symbol)\n3. Set funding goals\n4. Launch your token",
  price: "Token prices are determined by our bonding curve algorithm, which ensures fair price discovery based on supply and demand.",
  liquidity: "Liquidity is automatically added to the native liquidity pool once the funding goal is reached.",
  wallet: "Please make sure your wallet is connected and you have enough EDU tokens for gas fees.",
  help: "I can help you with:\n• Token creation and launches\n• Understanding bonding curves\n• Liquidity pool mechanics\n• General blockchain questions",
};

const findBestResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();
  
  if (lowercaseInput.includes("create") || lowercaseInput.includes("token") || lowercaseInput.includes("launch")) {
    return PRESET_RESPONSES.token;
  }
  if (lowercaseInput.includes("price") || lowercaseInput.includes("cost")) {
    return PRESET_RESPONSES.price;
  }
  if (lowercaseInput.includes("liquidity") || lowercaseInput.includes("pool")) {
    return PRESET_RESPONSES.liquidity;
  }
  if (lowercaseInput.includes("wallet") || lowercaseInput.includes("connect")) {
    return PRESET_RESPONSES.wallet;
  }
  if (lowercaseInput.includes("help") || lowercaseInput.includes("what")) {
    return PRESET_RESPONSES.help;
  }
  
  return PRESET_RESPONSES.default;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your token launch assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, isBot: false };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse = findBestResponse(input);
      const botMessage: Message = { text: botResponse, isBot: true };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Need Help?</span>
        </button>
      )}

      {isOpen && (
        <div className="w-96 h-[500px] bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col border border-purple-500/20">
          <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-purple-400" />
              <span className="font-medium text-white">Token Launch Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-purple-500/10 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <ChatMessage key={index} text={msg.text} isBot={msg.isBot} />
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-purple-500/20"
          >
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about token creation..."
                className="flex-1 bg-purple-900/20 border border-purple-500/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white transition-all duration-200 ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg hover:shadow-purple-500/20"
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;