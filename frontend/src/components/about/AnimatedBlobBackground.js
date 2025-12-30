"use client";

import { motion } from "framer-motion";

export default function AnimatedBlobBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main blob */}
      <motion.div
        className="absolute rounded-full bg-primary/10 blur-[120px]"
        style={{
          width: "50%",
          height: "50%",
          top: "10%",
          left: "10%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary blob */}
      <motion.div
        className="absolute rounded-full bg-blue-500/10 blur-[100px]"
        style={{
          width: "35%",
          height: "35%",
          bottom: "20%",
          right: "5%",
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Accent blob */}
      <motion.div
        className="absolute rounded-full bg-indigo-400/10 blur-[80px]"
        style={{
          width: "25%",
          height: "25%",
          top: "60%",
          left: "25%",
        }}
        animate={{
          scale: [1, 1.4, 1],
          x: [0, 20, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}
