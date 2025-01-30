"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const Navbar = () => {
  return (
   
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="backdrop-blur-lg bg-white/10 rounded-2xl p-4 mb-8 flex items-center justify-between"
    >
      <div className="flex items-center space-x-2">
        {/* <Sparkles className="text-white" /> */}
        <span className="text-2xl font-bold bg-gradient-to-r from-white to-white text-transparent bg-clip-text">
          CareerVerse Ai
        </span>
      </div>
      
      <div className="flex space-x-6">
      {[
          { name: "Dashboard", path: "/dashboard" },
          { name: "Career Path", path: "/career-path" },
          { name: "Skills", path: "/skills" },
          { name: "Mentor", path: "/mentor" },
        ].map((item) => (
          <Link key={item.name} href={item.path} passHref>
            <motion.p
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              {item.name}
            </motion.p>
          </Link>
        ))}

          <motion.button
            
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-300 hover:text-white transition-colors"
          >            
            <UserButton />
          </motion.button>
            

        
      </div>
    </motion.div>
  );
};
