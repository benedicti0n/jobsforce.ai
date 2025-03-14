import React from "react";
import { motion } from "framer-motion";

export default function AILoader() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
      <motion.div
        className="relative w-40 h-40"
        animate={{ scale: [0.98, 1.02, 0.98] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        {/* Robot Head - Base */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="30" width="120" height="125" rx="20" fill="#FFDA44" stroke="#F5F5F5" strokeWidth="4" />
            <rect x="50" y="30" width="100" height="15" rx="5" fill="#FFEB99" />
            <rect x="65" y="155" width="70" height="15" rx="5" fill="#FFEB99" />
          </svg>
        </div>

        {/* Robot Face */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 1 }}
        >
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            {/* Eyes */}
            <g>
              <motion.circle 
                cx="70" 
                cy="80" 
                r="12" 
                fill="white" 
                stroke="#F5F5F5" 
                strokeWidth="2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              <motion.circle 
                cx="130" 
                cy="80" 
                r="12" 
                fill="white" 
                stroke="#F5F5F5" 
                strokeWidth="2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }}
              />
              
              {/* Pupils */}
              <motion.circle 
                cx="70" 
                cy="80" 
                r="5" 
                fill="#222"
                animate={{ 
                  cx: [70, 73, 67, 70],
                  cy: [80, 78, 82, 80] 
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
              <motion.circle 
                cx="130" 
                cy="80" 
                r="5" 
                fill="#222"
                animate={{ 
                  cx: [130, 133, 127, 130],
                  cy: [80, 78, 82, 80] 
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
            </g>

            {/* Mouth - Thinking Animation */}
            <motion.path
              d="M80 120 Q100 130 120 120"
              stroke="#222"
              strokeWidth="4"
              strokeLinecap="round"
              fill="transparent"
              animate={{ 
                d: [
                  "M80 120 Q100 130 120 120", 
                  "M80 125 Q100 135 120 125",
                  "M80 120 Q100 130 120 120"
                ]
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            />

            {/* Thinking bubbles */}
            <g>
              <motion.circle 
                cx="150" 
                cy="50" 
                r="6" 
                fill="white" 
                stroke="#FFDA44" 
                strokeWidth="2"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0 }}
              />
              <motion.circle 
                cx="165" 
                cy="35" 
                r="9" 
                fill="white" 
                stroke="#FFDA44" 
                strokeWidth="2"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.7 }}
              />
              <motion.circle 
                cx="185" 
                cy="20" 
                r="12" 
                fill="white" 
                stroke="#FFDA44" 
                strokeWidth="2"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1.4 }}
              />
            </g>

            {/* Antenna */}
            <rect x="95" y="10" width="10" height="20" fill="#FFDA44" />
            <motion.circle 
              cx="100" 
              cy="10" 
              r="8" 
              fill="#FFEB99"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </svg>
        </motion.div>
        
        {/* Processing Circles */}
        <div className="absolute -bottom-10 left-0 w-full flex justify-center">
          <div className="flex gap-3">
            <motion.div 
              className="w-3 h-3 rounded-full bg-yellow-400"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            />
            <motion.div 
              className="w-3 h-3 rounded-full bg-yellow-400"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.3 }}
            />
            <motion.div 
              className="w-3 h-3 rounded-full bg-yellow-400"
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.6 }}
            />
          </div>
        </div>
      </motion.div>
      
      <div className="mt-14 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-yellow-500 mb-2">Thinking...</h2>
        <p className="text-gray-600">Finding perfect job matches for you</p>
      </div>
    </div>
  );
}