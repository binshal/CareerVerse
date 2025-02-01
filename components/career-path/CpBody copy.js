// CpBody.js
"use client";
import React, { useState, useContext } from "react";
import axios from "axios";
import { useCareerContext } from "@/contextapi/CareerContext";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

const CpBody = () => {
  const { careerGoal, updateCareerGoal } = useCareerContext();
  const [localCareerGoal, setLocalCareerGoal] = useState(careerGoal);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();

  const handleInputChange = (e) => {
    setLocalCareerGoal(e.target.value);
  };

  const generateRoadmap = async () => {
    if (!localCareerGoal) {
      alert("Please enter your career goal.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          inputs: `Generate a detailed career roadmap for the following goal: ${localCareerGoal}. The roadmap should be structured with clear stages, each containing specific skills required. Format the response as follows: Stage 1: Description - Skill 1 - Skill 2 Stage 2: Description - Skill 3 - Skill 4 ...`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
          },
        }
      );
      const generatedRoadmap = response.data[0].generated_text;
      setRoadmap(generatedRoadmap);
      updateCareerGoal(localCareerGoal); // Update the global career goal
    } catch (error) {
      console.error("Error generating roadmap:", error);
      setError("Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseRoadmap = (roadmap) => {
    if (!roadmap) return [];

    const stages = [];
    let currentStage = null;
    const lines = roadmap.split("\n").filter((line) => line.trim() !== "");
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("Stage")) {
        if (currentStage && currentStage.description) {
          stages.push(currentStage);
        }
        const [title, ...descParts] = trimmedLine.split(":");
        currentStage = {
          title: title,
          description: descParts.join(":").trim(),
          skills: [],
        };
      } else if (currentStage) {
        if (trimmedLine.startsWith("-")) {
          const skill = trimmedLine.substring(1).trim();
          if (skill && !skill.toLowerCase().startsWith("skill")) {
            currentStage.skills.push(skill);
          }
        } else if (trimmedLine) {
          currentStage.description = currentStage.description
            ? `${currentStage.description} ${trimmedLine}`
            : trimmedLine;
        }
      }
    });
    if (currentStage && currentStage.description) {
      stages.push(currentStage);
    }
    return stages;
  };

  const handleEdit = () => {
    setRoadmap(null); // Clear the roadmap to show the input form again
  };
  return (
    <div className="min-h-screen p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          {user ? "Welcome " + user.username : "username is not available"}
        </h2>

        {!roadmap && (
          <div className="mb-8">
            <input
              type="text"
              value={localCareerGoal}
              onChange={handleInputChange}
              placeholder="Enter your career goal (e.g., 'AI Engineer')"
              className="w-full p-4 mb-4 bg-transparent rounded-lg border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateRoadmap}
              disabled={loading}
              className={`text-white hover:text-gray-300 transition-colors bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-800`}
            >
              {loading ? "Generating..." : "Generate Roadmap"}
            </motion.button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        )}
        {roadmap && (
          <div className="mb-12 text-right">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="text-white hover:text-gray-300 transition-colors bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-800"
            >
              Edit Career Goal
            </motion.button>
          </div>
        )}

        {roadmap && (
          <div className="relative pl-16">
            <div className="absolute left-5 top-8 bottom-8 w-1 bg-blue-500" />
            <div className="space-y-16">
              {parseRoadmap(roadmap).map((stage, index) => (
                <div key={`stage-${index}`} className="relative">
                  {/* Connection dot */}
                  <div className="absolute -left-[60px] w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>

                  {/* Stage content */}
                  <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-semibold mb-4">
                      {stage.title}
                    </h3>
                    {stage.description && (
                      <p className="text-gray-300 mb-4">{stage.description}</p>
                    )}
                    {stage.skills.length > 0 && (
                      <ul className="space-y-2 text-sm list-disc list-inside text-gray-200">
                        {stage.skills.map((skill, skillIndex) => (
                          <li key={`skill-${index}-${skillIndex}`}>{skill}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CpBody;
