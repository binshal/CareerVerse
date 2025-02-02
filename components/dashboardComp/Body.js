"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  MessagesSquare,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const Body = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [careerGoal, setCareerGoal] = useState("");
  const [skills, setSkills] = useState([]);
  const [marketInsights, setMarketInsights] = useState(null);
  const [careerAdvice, setCareerAdvice] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawOutput, setRawOutput] = useState("");

  useEffect(() => {
    if (user?.id) {
      const storedData = localStorage.getItem(`career_data_${user.id}`);
      if (storedData) {
        const { careerGoal } = JSON.parse(storedData);
        setCareerGoal(careerGoal);
        loadSkills();
        generateMarketInsights(careerGoal);
        generateCareerAdvice(careerGoal);
      }
    }
  }, [user]);

  const loadSkills = () => {
    if (user?.id) {
      const storedSkills = localStorage.getItem(`skills_progress_${user.id}`);
      if (storedSkills) {
        const allSkills = JSON.parse(storedSkills);
        // Show only top 3 skills by progress
        setSkills(
          allSkills.sort((a, b) => b.progress - a.progress).slice(0, 3)
        );
      }
    }
  };

  const generateMarketInsights = async (goal) => {
    if (!goal) return;
    setLoading(true);

    try {
      setLoading(true)
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          inputs: `You are a career market analyst. Based on current market data, provide insights for ${goal} career path in exactly this format (numbers only, no explanations):
          Demand Growth: +X%
          Average Salary: $XXXK
          Job Openings: XK`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
          },
        }
      );

      // Parse the response text into structured data
      const text = response.data[0].generated_text;
      const insights = {
        demandGrowth: text.match(/Demand Growth: ([+-]\d+%)/)?.[1] || "+0%",
        avgSalary: text.match(/Average Salary: \$(\d+K)/)?.[1] || "N/A",
        openings: text.match(/Job Openings: (\d+K)/)?.[1] || "N/A",
      };

      setMarketInsights(insights);
    } catch (error) {
      console.error("Error generating insights:", error);
      // Set default values if there's an error
      setMarketInsights({
        demandGrowth: "+0%",
        avgSalary: "N/A",
        openings: "N/A",
      });
    } finally {
      setLoading(false);
    }
  };

  // Similar update for career advice generation
    const generateCareerAdvice = async (goal) => {
      if (!goal) return;
      setLoading(true)
  
      try {
        const response = await axios.post(
          "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
          {
            inputs: `Generate brief career advice for someone pursuing a career as ${goal}. Include: 1. Next milestone to achieve 2. Estimated timeline for career growth. Keep it concise.`,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
            },
          }
        );
  
        // Validate response format
        if (
          !response.data ||
          !Array.isArray(response.data) ||
          !response.data[0]?.generated_text
        ) {
          throw new Error("Unexpected response format from Hugging Face API");
        }
  
        const generatedText = response.data[0].generated_text;
        setRawOutput(generatedText);
        console.log("Raw generated text:", generatedText);
  
        // Define markers to extract the two sections
        const milestoneMarker = "Next milestone to achieve:";
        const timelineMarker = "Estimated timeline for career growth:";
  
        // Find the start positions of each section
        const milestoneStart = generatedText.indexOf(milestoneMarker);
        const timelineStart = generatedText.indexOf(timelineMarker);
  
        let milestone = "";
        let timeline = "";
  
        // Ensure both markers are found
        if (milestoneStart !== -1 && timelineStart !== -1) {
          // Extract text for milestone between the two markers
          milestone = generatedText
            .substring(
              milestoneStart + milestoneMarker.length,
              timelineStart
            )
            .trim();
  
          // Extract text for timeline starting after the timeline marker.
          // If there's additional text after timeline (like extra notes), it will be included.
          timeline = generatedText
            .substring(timelineStart + timelineMarker.length)
            .trim();
        } else {
          // Fallback: split by newlines if markers are not found
          const lines = generatedText.split("\n").map((line) => line.trim());
          milestone = lines[0] || "";
          timeline = lines[1] || "";
        }
  
        setCareerAdvice({ milestone, timeline });
      } catch (error) {
        console.error("Error generating advice:", error);
      }finally{
        setLoading(false)
      }
    };

  const handleChatSubmit = () => {
    if (!input.trim()) return;

    // Store the question in localStorage for the mentor page
    if (user?.id) {
      localStorage.setItem(`pending_question_${user.id}`, input);
    }
    router.push("/mentor");
  };

  
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center mt-56">
       <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
     </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center mt-56">
       <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
     </div>
    );
  }

  return (
    <> 
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* AI Career Advisor Card */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center space-x-4 mb-6">
          <Brain className="text-blue-400 h-8 w-8" />
          <h2 className="text-xl font-bold">AI Career Advisor</h2>
        </div>

        {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center items-center mt-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

        {careerAdvice && (
          <div className="flex space-x-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1 bg-white/5 rounded-xl p-4"
            >
              <Target className="text-purple-400 mb-2" />
              <h3 className="font-semibold mb-2">Next Milestone</h3>
              <p className="text-sm text-gray-300">{careerAdvice.milestone}</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-1 bg-white/5 rounded-xl p-4"
            >
              <TrendingUp className="text-green-400 mb-2" />
              <h3 className="font-semibold mb-2">Growth Trajectory</h3>
              <p className="text-sm text-gray-300">{careerAdvice.timeline}</p>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Skills Progress Card */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 cursor-pointer"
        onClick={() => router.push("/skills")}
      >
        <div className="flex items-center space-x-4 mb-6">
          <Award className="text-blue-400 h-8 w-8" />
          <h2 className="text-xl font-bold">Skills Progress</h2>
        </div>

        {skills.map((skill) => (
          <div key={skill.name} className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm">{skill.name}</span>
              <span className="text-sm text-blue-400">{skill.progress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.progress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Market Insights Card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center space-x-4 mb-6">
          <TrendingUp className="text-blue-400 h-8 w-8" />
          <h2 className="text-xl font-bold">Market Insights</h2>
        </div>

        {loading && (
        <div className="flex justify-center items-center mt-14">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
        {marketInsights && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Demand Growth", value: marketInsights.demandGrowth },
              { label: "Avg. Salary", value: `$${marketInsights.avgSalary}` },
              { label: "Job Openings", value: marketInsights.openings },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 rounded-xl p-4 text-center"
              >
                <h3 className="text-gray-300 text-sm mb-2">{stat.label}</h3>
                <p className="text-2xl font-bold text-green-400">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* AI Mentor Chat Card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => router.push("/mentor")}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 cursor-pointer"
      >
        <div className="flex items-center space-x-4 mb-6">
          <MessagesSquare className="text-blue-400 h-8 w-8" />
          <h2 className="text-xl font-bold">AI Mentor</h2>
        </div>

        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 rounded-xl p-4"
          >
            <p className="text-sm text-gray-300">
              Ask me anything about your career path!
            </p>
          </motion.div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleChatSubmit}
              className="px-4 py-2 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors"
            >
              Ask
            </button>
          </div>
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default Body;
