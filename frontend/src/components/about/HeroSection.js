"use client";
import { motion } from "framer-motion";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AnimatedBlobBackground from "./AnimatedBlobBackground";

export default function AboutHeroSection() {
  const description = "At Atorix IT, we are dedicated to delivering innovative technology solutions that drive business growth. Our team of experts combines creativity with technical expertise to build cutting-edge applications and services that help our clients succeed in the digital age.";


  return (
    <section className="relative overflow-hidden flex items-center justify-center bg-background">
      <div className="relative w-full max-w-7xl h-[500px] sm:h-[600px] md:h-[650px] lg:h-[700px] xl:h-[750px] mx-auto">
        {/* Video Container with proper constraints */}
        <div className="absolute inset-0">
          {/* Dark Theme Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover dark:block hidden"
          >
            <source src="https://res.cloudinary.com/deni4qbla/video/upload/v1757913598/Futuristic_interface___HUD_sound_effects_720p_e65uch.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Light Theme Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover dark:hidden block"
          >
            <source src="https://res.cloudinary.com/deni4qbla/video/upload/v1760692802/VID_20251017141956_hdthph.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40"></div>
        </div>
      </div>

      {/* Centered Logo with Letter-by-Letter Animation */}
      <div className="absolute inset-0 flex items-center justify-center z-[2] max-w-7xl mx-auto left-0 right-0">
        <div className="text-center">
          {/* ATORIX */}
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-wider leading-none">
            {['A', 'T', 'O', 'R', 'I', 'X'].map((letter, index) => (
              <motion.span
                key={`atorix-${index}`}
                className="inline-block text-black dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          {/* IT */}
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-normal mt-[-0.5rem]">
            {['I', 'T'].map((letter, index) => (
              <motion.span
                key={`it-${index}`}
                className="inline-block text-black dark:text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.6 + (index * 0.1),
                  ease: "easeOut"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Optional backdrop section - removed for better alignment */}
      
      {/* Description at bottom - with proper container alignment */}
      <div className="absolute inset-0 flex items-end pointer-events-none max-w-7xl mx-auto left-0 right-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl w-full">
          <div className="flex justify-start mb-4 sm:mb-6 lg:mb-8">
            <motion.div 
              className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 sm:p-5 md:p-6 bg-black/70 backdrop-blur-md rounded-lg shadow-2xl pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">About Us</h2>
              <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed">
                {description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}