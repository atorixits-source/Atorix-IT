"use client";

import { motion } from "framer-motion";

export default function ProcessSteps({ steps }) {
  return (
    <div className="space-y-12 relative">
      {/* Connecting line */}
      <div className="absolute left-[27px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary via-primary/40 to-transparent"></div>

      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex gap-6"
        >
          <div className="relative">
            {/* Step number circle */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-xl shadow-md">
              {index + 1}
            </div>

            {/* Connecting dots after each step except the last one */}
            {index !== steps.length - 1 && (
              <div className="absolute left-7 top-14 h-12 flex flex-col items-center justify-between gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-primary/60"></div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 pt-2">
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>

            {/* Optional details if provided */}
            {step.details && (
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5"></span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
