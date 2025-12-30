"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

const ServiceCTASection = ({
  title = "Ready to Transform Your Business with SAP?",
  description = "Contact our team today to discuss how our SAP services can help your organization achieve its goals.",
  primaryButton = { text: "Contact Us", href: "/contact" },
  secondaryButton = { text: "View All Services", href: "/services" },
  showGrid = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background overlay with white in light mode and gradient in dark */}
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
      </div>

      <div className="container-custom relative z-10">
        {showGrid ? (
          // Grid layout (SAP style - Top text, Bottom centered buttons)
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {title}
            </motion.h2>
            <motion.p
              className={`text-lg mb-8 max-w-3xl mx-auto ${
                isDark ? 'text-white/90' : 'text-gray-700'
              }`}
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {description}
            </motion.p>
            
            {/* Buttons centered horizontally */}
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 transition-all group relative overflow-hidden"
                >
                  <Link href={primaryButton.href} className="relative inline-flex items-center gap-2">
                    <span className="relative z-10">{primaryButton.text}</span>
                    <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                  </Link>
                </Button>
              </motion.div>

              {secondaryButton && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className={isDark 
                      ? 'bg-transparent text-white border-white/20 hover:bg-white/10' 
                      : 'bg-white/90 text-blue-600 border-blue-600 hover:bg-blue-50'
                    }
                  >
                    <Link href={secondaryButton.href}>
                      {secondaryButton.text}
                    </Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          // Centered layout (Data Science style - Center aligned with 2 buttons)
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className={`text-3xl md:text-4xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {title}
            </motion.h2>

            <motion.p
              className={`text-xl mb-8 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {description}
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 transition-all group relative overflow-hidden"
                >
                  <Link href={primaryButton.href} className="relative inline-flex items-center gap-2">
                    <span className="relative z-10">{primaryButton.text}</span>
                    <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                  </Link>
                </Button>
              </motion.div>
           
              {secondaryButton && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className={isDark 
                      ? 'bg-transparent text-white border-white/20 hover:bg-white/10' 
                      : 'bg-white/90 text-blue-600 border-blue-600 hover:bg-blue-50'
                    }
                  >
                    <Link href={secondaryButton.href}>
                      {secondaryButton.text}
                    </Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ServiceCTASection;