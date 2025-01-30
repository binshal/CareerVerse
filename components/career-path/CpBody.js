"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Circle, TrendingUp } from 'lucide-react';

const CpBody = () => {
  const currentYear = 2024;

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Career Path Timeline */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="md:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-2xl font-bold mb-6">Mohammed's Career Path</h2>
          
          {/* Timeline Header */}
          <div className="mb-8">
            <div className="relative h-2 bg-gray-700 rounded-full mb-2">
              <div className="absolute left-0 top-0 h-full w-1/4 bg-blue-500 rounded-full" />
              <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full" />
            </div>
            <div className="flex justify-between text-sm">
              <span>{currentYear}</span>
              <span>2025</span>
              <span>2030</span>
            </div>
          </div>

          {/* Career Stages */}
          <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:h-[calc(100%-2rem)] before:w-px before:bg-gray-700">
            {[
              { title: "Full Stack Developer (Now)", skills: ["Python Mastery (70%)", "AWS Certification (Pending)"] },
              { title: "Senior Developer (Q3 2025)", skills: ["System Architecture (0%)", "Team Leadership (0%)"] },
              { title: "Tech Lead (2026)", skills: ["Management Track", "Technical Expert Track"] },
              { title: "CTO (2030)", skills: ["Leadership Skills Development", "Executive Education"] }
            ].map((stage, index) => (
              <div key={index} className="relative pl-10">
                <Circle className="absolute left-0 top-1 w-4 h-4 text-blue-500" />
                <h3 className="text-lg font-semibold mb-4">{stage.title}</h3>
                <div className="space-y-4 pl-6 border-l border-dashed border-gray-600">
                  {stage.skills.map((skill, i) => (
                    <p key={i} className="text-sm">🔹 {skill}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Side Panel - Focus Area */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold mb-6">Current Focus Area</h2>
          
          <div className="mb-6">
            <h4 className="font-medium mb-2">Python Mastery Roadmap:</h4>
            <div className="h-2 bg-gray-700 rounded-full mb-4">
              <div className="h-full w-[70%] bg-blue-500 rounded-full" />
            </div>
            <div className="space-y-2 text-sm">
              <p>✅ Basic Syntax</p>
              <p>✅ Web Development</p>
              <p>🔹 Data Structures</p>
              <p>🔹 Algorithms</p>
              <p>🔹 ML Integration</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Recommended Resources:</h4>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Advanced Python Course (3h/week)</li>
              <li>Real-world Project: Build AI Chatbot</li>
              <li>Mentorship Program Pairing</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CpBody;
