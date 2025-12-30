"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { useEffect, useState } from "react";

export default function IndustryCtaSection() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a simple loading state during SSR
    return (
      <section className="py-16 md:py-20 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 text-white relative overflow-hidden">
      {/* Theme-based Animated Background with SVG Waves */}
      <div className={`absolute inset-0 overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-black via-slate-950 to-black' 
          : 'bg-white'
      }`}>
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-transparent' 
            : 'bg-gradient-to-br from-slate-50 to-blue-50'
        }`}></div>
        
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? "rgba(6, 182, 212, 0)" : "rgba(59, 130, 246, 0)"} />
              <stop offset="30%" stopColor={isDark ? "rgba(6, 182, 212, 0.8)" : "rgba(59, 130, 246, 0.7)"} />
              <stop offset="70%" stopColor={isDark ? "rgba(6, 182, 212, 0.8)" : "rgba(59, 130, 246, 0.7)"} />
              <stop offset="100%" stopColor={isDark ? "rgba(6, 182, 212, 0)" : "rgba(59, 130, 246, 0)"} />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? "rgba(14, 165, 233, 0)" : "rgba(14, 165, 233, 0)"} />
              <stop offset="30%" stopColor={isDark ? "rgba(14, 165, 233, 0.6)" : "rgba(14, 165, 233, 0.6)"} />
              <stop offset="70%" stopColor={isDark ? "rgba(14, 165, 233, 0.6)" : "rgba(14, 165, 233, 0.6)"} />
              <stop offset="100%" stopColor={isDark ? "rgba(14, 165, 233, 0)" : "rgba(14, 165, 233, 0)"} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
         
          {/* Multiple horizontal flowing wave ribbons */}
          {Array.from({ length: 15 }).map((_, i) => {
            const baseY = 150 + (i * 10);
            const amplitude = 30 + Math.sin(i * 0.5) * 20;
            const frequency = 0.005 + (i % 3) * 0.001;
            const phase = (i * 0.5) % (Math.PI * 2);
           
            // Create wave pattern - extended to ensure seamless loop
            let path = `M -200 ${baseY}`;
            for (let x = -200; x <= 1200; x += 3) {
              const y = baseY +
                Math.sin(x * frequency + phase) * amplitude * 0.8 +
                Math.sin(x * 0.0015 + phase * 2) * 15;
              path += ` L ${x} ${y}`;
            }
           
            const speed = 20 + (i % 5) * 5;
            const delay = -i * 0.3;
            const opacity = isDark 
              ? 0.25 + (i % 4) * 0.05
              : 0.45 + (i % 4) * 0.08;
           
            return (
              <g key={i}>
                <path
                  d={path}
                  fill="none"
                  stroke={i % 3 === 0 ? "url(#waveGrad1)" : "url(#waveGrad2)"}
                  strokeWidth={i % 4 === 0 ? "1.2" : "0.8"}
                  opacity={opacity}
                  filter="url(#glow)"
                  style={{
                    animation: `flowWave ${speed}s linear infinite`,
                    animationDelay: `${delay}s`,
                  }}
                />
              </g>
            );
          })}
        </svg>
       
        {/* Additional glow effects */}
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5' 
            : 'bg-gradient-to-r from-blue-200/10 via-transparent to-blue-200/10'
        }`}></div>
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-transparent via-blue-500/5 to-transparent' 
            : 'bg-gradient-to-b from-transparent via-blue-200/10 to-transparent'
        }`}></div>

        {/* Floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className={isDark ? 'absolute rounded-full bg-blue-400/20' : 'absolute rounded-full bg-blue-100/20'}
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatParticle ${Math.random() * 20 + 20}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.6 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes flowWave {
          0% { 
            transform: translateX(0);
          }
          100% { 
            transform: translateX(-628.3px);
          }
        }
        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(0) translateX(20px);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }
      `}</style>

      <div className="container-custom relative z-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="md:col-span-8">
            <motion.h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              Let's Discuss Your Industry-Specific Needs
            </motion.h2>
            <motion.p
              className={`text-lg mb-0 ${
                isDark ? 'text-white/90' : 'text-gray-700'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Contact our team to learn how our SAP solutions can address the
              unique challenges in your industry and drive digital
              transformation.
            </motion.p>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 w-full md:w-auto shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 relative"
                >
                  <span className="relative z-10">Contact Us</span>
                  <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
