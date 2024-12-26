import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, X, Send } from "lucide-react";
import Cerebras from "@cerebras/cerebras_cloud_sdk";
import ChatMessage from "./ChatMessage";

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatCompletionChoice {
  message: {
    content: string;
    role: string;
  };
  finish_reason: string;
  index: number;
}

interface ChatCompletionResponse {
  id: string;
  choices: ChatCompletionChoice[];
  created: number;
  model: string;
  object: string;
}

const formatBotResponse = (text: string): string => {
  const formattedText = text
    .replace(/•/g, "\n•")
    .replace(/(\d+\.\s)/g, "\n$1")
    .replace(/(\*\*.*?\*\*)/g, "\n$1\n");

  return formattedText.replace(/\n{3,}/g, "\n\n").trim();
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

  const client = new Cerebras({
    apiKey: "csk-pfdwvj9f6mmfe5n698txm9m5ryvpmxv3t3n66evyvrnpc2rm",
  });

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

    try {
      const completionCreateResponse = (await client.chat.completions.create({
        messages: [{ role: "user", content: input }],
        model: "llama3.1-8b",
      })) as ChatCompletionResponse;

      const botResponseText = formatBotResponse(
        completionCreateResponse.choices[0]?.message?.content ||
          "Sorry, I didn't understand that."
      );

      const botMessage: Message = { text: botResponseText, isBot: true };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
              <span className="font-medium text-white">
                Token Launch Assistant
              </span>
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
