"use client";

import { motion } from "framer-motion";

// Industry Grid Item Component for compact grid view
export default function IndustryGridItem({ industry }) {
  const IconComponent = industry.icon;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="industry-card bg-card rounded-xl p-5 border border-border/40 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col items-center"
    >
      <div className="industry-icon w-14 h-14 rounded-full bg-primary/5 dark:bg-primary/10 text-primary/70 dark:text-primary/80 flex items-center justify-center mb-3">
        <IconComponent size={28} />
      </div>
      <h3 className="font-medium text-center">{industry.name}</h3>
    </motion.div>
  );
}
