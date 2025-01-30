"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, GraduationCap } from "lucide-react";

const skills = [
  { 
    name: "Python", 
    progress: 70,
    daysLeft: 14,
    resources: ["Advanced Python Course", "ML Project: Fraud Detection"],
    category: "Core Skills"
  },
  { 
    name: "Machine Learning", 
    progress: 75,
    daysLeft: 21,
    resources: ["TensorFlow Certification", "Kaggle Competition"],
    category: "AI Specialization"
  },
  { 
    name: "Data Analysis", 
    progress: 80,
    daysLeft: 7,
    resources: ["SQL Masterclass", "Business Analytics Project"],
    category: "Data Science"
  },
];

export default function SkillsBody() {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">{skill.name}</h3>
                <p className="text-gray-400 text-sm">{skill.category}</p>
              </div>
              <span className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded-full text-sm">
                {skill.daysLeft} days left
              </span>
            </div>

            <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${skill.progress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <GraduationCap size={16} />
                <span>{skill.progress}% Mastery</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{skill.daysLeft} days to complete</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              <h4 className="text-sm font-semibold text-gray-400 mb-2">Recommended Resources</h4>
              <div className="space-y-2">
                {skill.resources.map((resource, i) => (
                  <div key={i} className="flex items-center space-x-2 p-2 bg-white/5 rounded-lg">
                    <BookOpen size={16} className="text-blue-400" />
                    <span className="text-gray-300">{resource}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
