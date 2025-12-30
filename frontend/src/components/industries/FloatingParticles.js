"use client";

import { motion } from "framer-motion";

// Floating particles component for background enhancement with increased speed
export default function FloatingParticles({ count = 50 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 12 + 4; // Increased size
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 10 + 5; // Increased speed (was 20 + 10)
        const delay = Math.random() * 2; // Reduced delay (was 5)

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/30"
            style={{
              width: size,
              height: size,
              top: `${startY}%`,
              left: `${startX}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
