"use client";
import React from "react";
import { motion } from "framer-motion";
import { Link, Sparkles } from "lucide-react";

export const HomeNav = () => {
  return (
    <div className="backdrop-blur-lg rounded-2xl p-4 mb-8 flex items-center justify-end">
      <motion.div
        initial={{ x: 40, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex items-center space-x-2"
      >
        <span className="text-9xl mr-32 font-bold bg-gradient-to-r from-black to-black text-transparent bg-clip-text">
          CareerVerse <span className="text-white">Ai</span>
        </span>
      </motion.div>
    </div>
  );
};
