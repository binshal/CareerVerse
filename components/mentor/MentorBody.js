"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Send, StopCircle, Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

export default function MentorBody() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [careerGoal, setCareerGoal] = useState(""); // State to store the user's career goal
  const { isLoaded, isSignedIn, user } = useUser();

  // Fetch careerGoal from local storage on component mount
  useEffect(() => {
    if (user?.id) {
      const storedData = localStorage.getItem(`career_data_${user.id}`);
      if (storedData) {
        const { careerGoal } = JSON.parse(storedData);
        setCareerGoal(careerGoal);
      }
    }
  }, [user]);

  // Function to handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Check if the user has set a career goal
    if (!careerGoal) {
      setError("Please set your career goal in the Career Path section.");
      return;
    }

    // Add user message to the chat
    setMessages((prev) => [...prev, { content: input, isAI: false }]);
    setIsGenerating(true);
    setError(""); // Clear any previous errors
    setInput("");

    try {
      // Generate AI response using Hugging Face API
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          inputs: `You are a professional career mentor. Provide clear and concise advice for someone with the career goal: "${careerGoal}". Question: ${input}. Format the response professionally with bullet points or sections where applicable.`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
          },
        }
      );

      let aiResponse = response.data[0]?.generated_text || "No response available.";

      // Remove unwanted prefix from the response
      const prefixToRemove = `You are a professional career mentor. Provide clear and concise advice for someone with the career goal: "${careerGoal}". Question: ${input}. Format the response professionally with bullet points or sections where applicable.`;
      if (aiResponse.startsWith(prefixToRemove)) {
        aiResponse = aiResponse.slice(prefixToRemove.length).trim();
      }

      setMessages((prev) => [...prev, { content: aiResponse, isAI: true }]);
    } catch (err) {
      console.error("Error generating AI response:", err);
      setError("Failed to generate a response. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to parse and format AI response
  const formatAIResponse = (content) => {
    // Replace newlines with <br> for better rendering
    return content.split("\n").map((line, index) => {
      if (line.startsWith("-")) {
        // Render bullet points
        return (
          <li key={index} className="ml-4 list-disc">
            {line.substring(1).trim()}
          </li>
        );
      }
      // Render normal text
      return <p key={index}>{line}</p>;
    });
  };

  if (!isLoaded || !isSignedIn) {
    return <div className="text-center text-white">Please sign in to access the mentor.</div>;
  }

  if (!careerGoal) {
    return (
      <div className="text-center text-white">
        Please set your career goal in the Career Path section first.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 text-white">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4 text-center">AI Career Mentor</h1>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex items-start gap-2 ${
              message.isAI ? "justify-center" : "justify-end"
            }`}
          >
            <div
              className={`rounded-lg px-6 py-4 max-w-2xl ${
                message.isAI
                  ? "bg-gray-800 text-white self-center shadow-lg"
                  : "bg-gray-700 text-white self-end shadow-lg"
              }`}
            >
              {message.isAI ? (
                <div className="space-y-2">{formatAIResponse(message.content)}</div>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
            {message.isAI ? (
              <Bot size={16} className="text-gray-400" />
            ) : (
              <User size={16} className="text-gray-400" />
            )}
          </motion.div>
        ))}
        {isGenerating && (
          <div className="text-center text-gray-400">AI is generating response...</div>
        )}
        {error && <div className="text-red-500 text-center">{error}</div>}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
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
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          disabled={isGenerating}
        >
          {isGenerating ? <StopCircle size={16} /> : <Send size={16} />}
        </button>
      </form>

      {/* Suggestions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {["Improve Python skills", "Recommended certifications", "AI Career Paths", "Market Trends"].map(
          (text, index) => (
            <button
              key={index}
              onClick={() => setInput(text)}
              className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm border border-white/10"
            >
              {text}
            </button>
          )
        )}
      </div>
    </div>
  );
}