"use client";

import { useState } from "react";
import { Send, StopCircle, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

export default function MentorBody() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { content: input, isAI: false }]);
    setIsGenerating(true);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          content: `Great question about ${input}! Here's a detailed response with career advice...`,
          isAI: true,
        },
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className=" text-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Career Mentor</h1>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 h-[350px] flex flex-col border border-white/20"
        >
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 scrollable-div">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: message.isAI ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${message.isAI ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl border border-white/10 ${
                    message.isAI ? "bg-gray-700" : "bg-blue-600"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {message.isAI ? (
                      <Bot size={20} className="text-green-400" />
                    ) : (
                      <User size={20} className="text-blue-300" />
                    )}
                    <span className="text-sm font-medium">
                      {message.isAI ? "Career AI" : "You"}
                    </span>
                  </div>
                  <p className="text-gray-100">{message.content}</p>
                </div>
              </motion.div>
            ))}

            {isGenerating && (
              <div className="flex items-center space-x-2 text-gray-400 animate-pulse">
                <Bot size={20} className="text-green-400" />
                <span>AI is generating response...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your career path..."
              className="w-full p-4 pr-16 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/20"
              disabled={isGenerating}
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <StopCircle className="text-red-400" />
              ) : (
                <Send className="text-blue-400" />
              )}
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {["Improve Python skills", "Recommended certifications", "AI Career Paths", "Market Trends"].map((text, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              onClick={() => setInput(text)}
              className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm border border-white/10"
            >
              {text}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
