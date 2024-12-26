import React from "react";

interface ChatMessageProps {
  text: string;
  isBot: boolean;
}

const ChatMessage = ({ text, isBot }: ChatMessageProps) => {
  // Split long messages into paragraphs
  const paragraphs = text.split("\n").filter((p) => p.trim());

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[80%] p-3 rounded-2xl space-y-2 ${
          isBot
            ? "bg-purple-500/20 text-white"
            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        }`}
      >
        {paragraphs.map((paragraph, idx) => (
          <p key={idx} className="text-sm leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ChatMessage;
