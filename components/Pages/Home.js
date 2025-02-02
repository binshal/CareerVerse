"use client"
import React from 'react'
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { HomeNav } from './HomeNav';
import Link from 'next/link';

const Home = () => {

  return (
    <>
      <HomeNav/>
      <div className="absolute bottom-0 left-0 flex w-full flex-1 items-center justify-around">
        {/* Left section with image */}
        <motion.div
        initial={{ x: -40, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        className="flex-shrink-0 mr-0">
          <img
            src="/HomePortrait.png"
            alt="Women Portrait"
            className="w-auto h-screen"
          />
        </motion.div>

        {/* Middle section with text and buttons */}
        <div className="flex mr-56">
          {" "}
          {/* Added ml-12 for spacing */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl text-black font-bold">
              The Ultimate Career Simulation
            </h2>
            <div className="space-y-2">
              <p className="text-gray-300">
                Unlock your future with AI-powered career guidance! <br />
                Our platform provide a step-by-step roadmap to success.
              </p>
            </div>
            <div className="space-x-4 pt-4">
            <Link href={"/about"}>
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                className="text-white hover:text-gray-300 transition-colors bg-gray-600 px-6 py-2 rounded-lg hover:bg-gray-700"
              >
                ReadMore
              </motion.button>
              </Link>

              <Link href={"/sign-in"}>
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                className="text-white hover:text-gray-300 transition-colors bg-blue-800 px-6 py-2 rounded-lg hover:bg-blue-900"
              >
                SignUp / SignIn
              </motion.button>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
