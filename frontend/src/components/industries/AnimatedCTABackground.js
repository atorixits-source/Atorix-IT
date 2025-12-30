"use client";

import { motion } from "framer-motion";

// Animated background for CTA section
export default function AnimatedCTABackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated gradient overlay with varying colors */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 opacity-80"></div>

      {/* Additional diagonal gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-transparent to-cyan-500/30"></div>

      {/* Animated circles with color variations */}
      {Array.from({ length: 12 }).map((_, i) => {
        const size = Math.random() * 400 + 150;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 30 + 20;

        // Different colors for variety
        const colors = [
          "bg-blue-500/20",
          "bg-purple-500/20",
          "bg-indigo-500/20",
          "bg-cyan-500/20",
          "bg-pink-500/20"
        ];
        const colorClass = colors[i % colors.length];

        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${colorClass}`}
            style={{
              width: size,
              height: size,
              top: `${posY}%`,
              left: `${posX}%`,
              filter: "blur(60px)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.3, 0.1],
              x: [0, 70, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Animated lines with color variations */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 15 }).map((_, i) => {
          const top = Math.random() * 100;
          const width = Math.random() * 30 + 10;
          const delay = Math.random() * 5;

          // Different colors for the lines
          const colors = ["bg-white", "bg-blue-200", "bg-indigo-200", "bg-purple-200"];
          const colorClass = colors[i % colors.length];

          return (
            <motion.div
              key={i}
              className={`absolute h-px ${colorClass} left-0 right-0`}
              style={{ top: `${top}%` }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 1, 0],
                opacity: [0, 0.7, 0],
                left: ["0%", `${width}%`, "100%"],
              }}
              transition={{
                duration: 8,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Light dots effect with increased count and brightness */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => {
          const size = Math.random() * 4 + 1;
          const posX = Math.random() * 100;
          const posY = Math.random() * 100;
          const delay = Math.random() * 5;

          return (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: size,
                height: size,
                top: `${posY}%`,
                left: `${posX}%`,
              }}
              animate={{
                opacity: [0, 0.9, 0], // Increased max opacity
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: delay,
                repeat: Infinity,
                repeatDelay: Math.random() * 5 + 2,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
