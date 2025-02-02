"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

const About = () => {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="flex max-w-2xl mx-auto rounded-lg p-8 justify-center items-center">
        <div className="space-y-6 text-gray-300">
          <p className="text-lg text-center justify-center">
            Welcome to CareerVerse Ai - your intelligent career planning
            companion. This beta version leverages advanced AI to help you
            visualize and track your professional development journey.
          </p>

          <div className="bg-orange-100 p-4 rounded-lg border border-orange-200">
            <h2 className="text-xl font-semibold text-orange-600 mb-2">
              Beta Notice
            </h2>
            <p className="text-base text-black">
              Please note this is an experimental version. Your roadmap data is
              stored locally in your browser - clearing history or cache will
              permanently erase your progress. We recommend regularly exporting
              your career plan.
            </p>
          </div>

          <p className="text-lg text-center">
            Our team is continuously working to improve your experience. Feel
            free to share feedback through :
          </p>

          <div className="flex justify-center items-center">
            <a
              href="https://www.linkedin.com/in/mohammedbinshalp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center text-white hover:text-gray-300 transition-colors bg-blue-700 px-6 py-2 rounded-lg hover:bg-blue-800"
              >
                Linkedin
                <Linkedin
                  size={25}
                  className="text-blue-500 hover:text-blue-600 transition-colors ml-2"
                />
              </motion.button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
