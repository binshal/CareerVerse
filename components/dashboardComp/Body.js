"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Target, TrendingUp, MessagesSquare, Award } from 'lucide-react';

const Body = () => {
  return (
    <div>
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
          
          <div className="flex space-x-4 mb-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex-1 bg-white/5 rounded-xl p-4"
            >
              <Target className="text-purple-400 mb-2" />
              <h3 className="font-semibold mb-2">Next Milestone</h3>
              <p className="text-sm text-gray-300">Master Advanced Python - 2 weeks left</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex-1 bg-white/5 rounded-xl p-4"
            >
              <TrendingUp className="text-green-400 mb-2" />
              <h3 className="font-semibold mb-2">Growth Trajectory</h3>
              <p className="text-sm text-gray-300">On track for Senior role in 18 months</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Skills Progress Card */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Award className="text-blue-400 h-8 w-8" />
            <h2 className="text-xl font-bold">Skills Progress</h2>
          </div>

          {['Python', 'Machine Learning', 'Data Analysis'].map((skill, index) => (
            <div key={skill} className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm">{skill}</span>
                <span className="text-sm text-blue-400">{70 + index * 5}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${70 + index * 5}%` }}
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

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Demand Growth', value: '+45%' },
              { label: 'Avg. Salary', value: '$120K' },
              { label: 'Job Openings', value: '2.5K' }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 rounded-xl p-4 text-center"
              >
                <h3 className="text-gray-400 text-sm mb-2">{stat.label}</h3>
                <p className="text-2xl font-bold text-blue-400">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Mentor Chat Card */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
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
              <p className="text-sm text-gray-300">Ask me anything about your career path!</p>
            </motion.div>
            <input 
              type="text" 
              placeholder="Type your question..."
              className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Body
