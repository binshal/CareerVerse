"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Import the button component

export const AboutNav = () => {
  return (
    <div className="relative backdrop-blur-lg rounded-2xl p-4 mb-8 flex items-center justify-center">
      {/* Button in the top-right corner */}
      <Link href={"/"}>
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-gray-600 px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                Get Started
              </motion.button>
              </Link>

      <motion.div
        initial={{ x: 0, opacity: 1 }}
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
