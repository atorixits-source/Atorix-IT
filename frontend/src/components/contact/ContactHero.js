"use client";
import React from "react";
import { motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import FloatingShapes from "./FloatingShapes";

export default function ContactHero() {
  const tagline = "Get in Touch";
  const title = "Let's Talk About Your Project";
  const description = "We're here to help and answer any questions you might have. We look forward to hearing from you.";
  return (
    <section className="py-16 md:py-24 bg-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      <FloatingShapes />

      <div className="container-custom relative z-10">
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          {/* Left: Text content */}
          <motion.div
            className="w-full md:w-1/2 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              {tagline}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl md:max-w-none mb-8">
              {description}
            </p>
          </motion.div>

          {/* Right: Lottie animation pinned to right corner */}
          <div className="relative w-full md:w-1/2">
            <div className="hidden md:block absolute right-12 top-1/2 -translate-y-1/2 w-[400px] h-[400px]">
              <DotLottieReact
                src="https://lottie.host/89bdfb9e-6c3d-4fcc-949d-e69d6fa3b9fb/z922hmlM5V.lottie"
                loop
                autoplay
              />
            </div>
            {/* Mobile placement: show below text and centered */}
            <div className="md:hidden flex justify-center">
              <div className="w-[240px] h-[240px]">
                <DotLottieReact
                  src="https://lottie.host/89bdfb9e-6c3d-4fcc-949d-e69d6fa3b9fb/z922hmlM5V.lottie"
                  loop
                  autoplay
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
