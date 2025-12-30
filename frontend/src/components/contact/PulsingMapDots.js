import { motion } from "framer-motion";

// Pulsing circles for map section
export default function PulsingMapDots() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* India location pulse */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-primary/30 blur-sm"
        style={{ left: "68%", top: "56%" }}
        animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* US location pulse */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-primary/30 blur-sm"
        style={{ left: "25%", top: "40%" }}
        animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.7,
        }}
      />

      {/* Germany location pulse */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-primary/30 blur-sm"
        style={{ left: "50%", top: "35%" }}
        animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.4,
        }}
      />
    </div>
  );
}
