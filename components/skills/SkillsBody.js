"use client";

import { motion } from "framer-motion";
import { Clock, GraduationCap, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const SkillsBody = () => {
  const [skills, setSkills] = useState([]);
  const [careerGoal, setCareerGoal] = useState("");
  const [editingDays, setEditingDays] = useState(null);
  const [previousGoal, setPreviousGoal] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (user?.id) {
      const careerData = localStorage.getItem(`career_data_${user.id}`);
      
      if (careerData) {
        const { careerGoal, roadmap } = JSON.parse(careerData);
        setCareerGoal(careerGoal);
        
        // Check if career goal has changed
        if (careerGoal !== previousGoal) {
          setPreviousGoal(careerGoal);
          handleCareerGoalChange(careerGoal, roadmap);
        }
      }
    }
  }, [user, previousGoal]);

  const handleCareerGoalChange = (newGoal, roadmap) => {
    if (!roadmap) return;

    const parsedRoadmap = parseRoadmap(roadmap);
    const existingSkills = localStorage.getItem(`skills_progress_${user.id}`);
    
    if (existingSkills) {
      const currentSkills = JSON.parse(existingSkills);
      const newSkills = generateInitialSkills(parsedRoadmap);
      
      // Merge existing skills with new skills
      const mergedSkills = mergeSkills(currentSkills, newSkills);
      setSkills(mergedSkills);
      saveSkillsToStorage(mergedSkills);
    } else {
      const initialSkills = generateInitialSkills(parsedRoadmap);
      setSkills(initialSkills);
      saveSkillsToStorage(initialSkills);
    }
  };

  const mergeSkills = (currentSkills, newSkills) => {
    // Create a map of current skills for quick lookup
    const currentSkillsMap = new Map(
      currentSkills.map(skill => [skill.name.toLowerCase(), skill])
    );

    return newSkills.map(newSkill => {
      const existingSkill = currentSkillsMap.get(newSkill.name.toLowerCase());
      if (existingSkill) {
        // Keep progress and days if skill exists
        return {
          ...newSkill,
          progress: existingSkill.progress,
          daysLeft: existingSkill.daysLeft,
          lastUpdated: existingSkill.lastUpdated
        };
      }
      return newSkill;
    });
  };

  // Add automatic day updates effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSkills(prevSkills => {
        const now = new Date();
        const updatedSkills = prevSkills.map(skill => {
          const lastUpdated = new Date(skill.lastUpdated);
          const daysDiff = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));
          
          if (daysDiff >= 1) {
            return {
              ...skill,
              daysLeft: Math.max(0, skill.daysLeft - daysDiff),
              lastUpdated: now.toISOString()
            };
          }
          return skill;
        });

        if (updatedSkills.some((skill, i) => skill.daysLeft !== prevSkills[i].daysLeft)) {
          saveSkillsToStorage(updatedSkills);
        }
        
        return updatedSkills;
      });
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);

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
      } else if (currentStage && trimmedLine.startsWith("-")) {
        const skill = trimmedLine.substring(1).trim();
        if (skill && !skill.toLowerCase().startsWith("skill")) {
          currentStage.skills.push(skill);
        }
      }
    });

    if (currentStage && currentStage.description) {
      stages.push(currentStage);
    }
    return stages;
  };

  const generateInitialSkills = (stages) => {
    let allSkills = [];
    stages.forEach((stage, stageIndex) => {
      stage.skills.forEach((skillName) => {
        allSkills.push({
          name: skillName,
          progress: 0,
          daysLeft: 30,
          category: stage.title,
          stageIndex: stageIndex,
          lastUpdated: new Date().toISOString()
        });
      });
    });
    return allSkills;
  };

  const saveSkillsToStorage = (updatedSkills) => {
    if (user?.id) {
      localStorage.setItem(
        `skills_progress_${user.id}`,
        JSON.stringify(updatedSkills)
      );
    }
  };

  const updateSkillProgress = (skillIndex, change) => {
    setSkills(prevSkills => {
      const updatedSkills = prevSkills.map((skill, index) => {
        if (index === skillIndex) {
          const newProgress = Math.min(100, Math.max(0, skill.progress + change));
          return {
            ...skill,
            progress: newProgress,
            lastUpdated: new Date().toISOString()
          };
        }
        return skill;
      });
      saveSkillsToStorage(updatedSkills);
      return updatedSkills;
    });
  };

  const handleDaysUpdate = (skillIndex, days) => {
    const numDays = parseInt(days);
    if (isNaN(numDays) || numDays < 1) return;

    setSkills(prevSkills => {
      const updatedSkills = prevSkills.map((skill, index) => {
        if (index === skillIndex) {
          return {
            ...skill,
            daysLeft: numDays,
            lastUpdated: new Date().toISOString()
          };
        }
        return skill;
      });
      saveSkillsToStorage(updatedSkills);
      return updatedSkills;
    });
    setEditingDays(null);
  };

  if (!isLoaded || !isSignedIn) {
    return <div className="text-center text-white">Please sign in to access your skills tracker.</div>;
  }

  if (!careerGoal) {
    return (
      <div className="text-center text-white">
        Please set your career goal in the Career Path section first.
      </div>
    );
  }

  // Rest of the component remains the same...
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Skills Tracker</h2>
          <p className="text-gray-400">Career Goal: {careerGoal}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                  <p className="text-gray-400 text-sm">{skill.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-sm">
                    {editingDays === index ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          className="w-16 bg-transparent border-b border-blue-400 text-center focus:outline-none"
                          defaultValue={skill.daysLeft}
                          min="1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleDaysUpdate(index, e.target.value);
                            }
                          }}
                          onBlur={(e) => handleDaysUpdate(index, e.target.value)}
                          autoFocus
                        />
                        <span>days</span>
                      </div>
                    ) : (
                      <span>{skill.daysLeft} days left</span>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingDays(editingDays === index ? null : index)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Pencil size={14} className="text-blue-400" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <Progress 
                  value={skill.progress} 
                  className="bg-white/10"
                  indicatorclass="bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">{skill.progress}% Complete</span>
                <div className="space-x-2">
                  <button
                    onClick={() => updateSkillProgress(index, -5)}
                    className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 text-white"
                  >
                    -5%
                  </button>
                  <button
                    onClick={() => updateSkillProgress(index, 5)}
                    className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 text-white"
                  >
                    +5%
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <GraduationCap size={16} />
                  <span>{skill.progress}% Mastery</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{skill.daysLeft} days</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsBody;