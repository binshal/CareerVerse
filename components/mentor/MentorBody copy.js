"use client";

import { useState, useEffect } from "react";
import { Send, StopCircle, Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function MentorBody() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [careerGoal, setCareerGoal] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();

  // Load career goal from localStorage when component mounts
  useEffect(() => {
    if (user?.id) {
      const storedData = localStorage.getItem(`career_data_${user.id}`);
      if (storedData) {
        const { careerGoal } = JSON.parse(storedData);
        setCareerGoal(careerGoal);
      }
    }
  }, [user]);

  const generateResponse = async (userInput) => {
    try {
      const prompt = `As an AI career mentor, provide detailed advice for someone pursuing a career as a ${careerGoal}. 
      They're asking: "${userInput}"
      
      Format your response in a clear, structured way with:
      1. Direct answer to their question
      2. Specific actionable advice
      3. Industry insights if relevant
      4. Next steps or resources
      
      Keep the tone professional but friendly and make it specific to ${careerGoal}.`;

      const response = await axios.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          inputs: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
          },
        }
      );

      return response.data[0].generated_text;
    } catch (error) {
      console.error("Error generating response:", error);
      return "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { content: userMessage, isAI: false }]);
    setInput("");
    setIsGenerating(true);

    const aiResponse = await generateResponse(userMessage);
    
    setMessages((prev) => [
      ...prev,
      {
        content: aiResponse,
        isAI: true,
      },
    ]);
    setIsGenerating(false);
  };

  // Suggested questions based on career goal
  const getSuggestedQuestions = () => {
    if (!careerGoal) return [
      "What career path should I choose?",
      "How do I set career goals?",
      "What skills are in demand?",
      "How to prepare for interviews?"
    ];

    return [
      `What skills do I need for ${careerGoal}?`,
      `Latest trends in ${careerGoal} field`,
      `Career progression path for ${careerGoal}`,
      `Recommended certifications for ${careerGoal}`
    ];
  };

  if (!isLoaded || !isSignedIn) {
    return <div className="text-center text-white">Please sign in to access your AI career mentor.</div>;
  }

  return (
    <div className="text-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">AI Career Mentor</h1>
          {careerGoal && (
            <div className="text-sm bg-blue-600/20 px-4 py-2 rounded-full">
              Career Goal: {careerGoal}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 h-[500px] flex flex-col border border-white/20"
        >
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 scrollable-div">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                <Bot size={40} className="mx-auto mb-4 text-blue-400" />
                <p className="mb-2">Hello! I'm your AI career mentor.</p>
                <p>I'm here to help guide you on your journey to becoming a {careerGoal || "successful professional"}.</p>
                <p className="text-sm mt-2">Ask me anything about your career path!</p>
              </div>
            )}

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
                  <div className="text-gray-100 whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              </motion.div>
            ))}

            {isGenerating && (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200" />
                </div>
                <span>Generating response...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={careerGoal ? `Ask me anything about becoming a ${careerGoal}...` : "Ask me anything about your career path..."}
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
          {getSuggestedQuestions().map((text, index) => (
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