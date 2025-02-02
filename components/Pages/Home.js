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
      <div className="md:absolute md:bottom-0 md:left-0 md:flex md:w-full md:flex-1 md:items-center md:justify-around">
        <div className="md:hidden w-full mt-[-85px]">
        <img
          src="/HomePortrait.png"
          alt="Women Portrait"
          className="w-auto object-cover overflow-hidden z-50"
        />
      </div>
        {/* Left section with image - hidden on mobile */}
        <motion.div
        initial={{ x: -40, opacity: 1 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:block flex-shrink-0 mr-0">
          <img
            src="/HomePortrait.png"
            alt="Women Portrait"
            className="w-auto h-screen"
          />
        </motion.div>

        {/* Middle section with text and buttons */}
        <div className="flex md:mr-56 mx-4">
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
            <div className="space-y-4 md:space-y-0 md:space-x-4 pt-4">
              <Link href={"/about"}>
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  className=" md:w-auto text-white hover:text-gray-300 transition-colors bg-gray-600 px-6 py-2 m-2 rounded-lg hover:bg-gray-700"
                >
                  ReadMore
                </motion.button>
              </Link>
              <Link href={"/sign-in"}>
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.95 }}
                  className=" md:w-auto text-white hover:text-gray-300 transition-colors bg-blue-800 px-6 py-2 rounded-lg hover:bg-blue-900"
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