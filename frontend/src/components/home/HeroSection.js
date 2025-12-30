"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import LogoSphere from "@/components/ui/LogoSphere";
import { motion } from "framer-motion";

export default function HeroSection() {
  // Add scroll animation for the "Scroll Down" button
  useEffect(() => {
    const handleScrollDown = () => {
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        window.scrollTo({
          top: servicesSection.offsetTop - 100,
          behavior: "smooth",
        });
      }
    };

    const scrollButton = document.getElementById("scroll-down-button");
    if (scrollButton) {
      scrollButton.addEventListener("click", handleScrollDown);
    }

    return () => {
      if (scrollButton) {
        scrollButton.removeEventListener("click", handleScrollDown);
      }
    };
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    },
  };

  return (
    <section className="relative overflow-hidden min-h-[90vh]">
      {/* Modern Geometric Background with Squares */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-primary/5" />

        {/* Square geometric pattern */}
        <div className="absolute inset-0">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="opacity-20"
          >
            {/* Pattern definition */}
            <defs>
              {/* Small squares pattern */}
              <pattern
                id="small-squares"
                x="0"
                y="0"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(15)"
              >
                <rect
                  x="0"
                  y="0"
                  width="3"
                  height="3"
                  fill="currentColor"
                  className="text-primary/30"
                />
              </pattern>

              {/* Medium squares pattern */}
              <pattern
                id="medium-squares"
                x="5"
                y="5"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="0"
                  y="0"
                  width="5"
                  height="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.3"
                  className="text-primary/40"
                />
              </pattern>

              {/* Larger squares for accent */}
              <pattern
                id="large-squares"
                x="0"
                y="0"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="5"
                  y="5"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary/20"
                />
                <rect
                  x="30"
                  y="30"
                  width="15"
                  height="15"
                  fill="currentColor"
                  className="text-primary/10"
                />
              </pattern>

              {/* Scattered tiny squares */}
              <pattern
                id="scattered-squares"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="10"
                  y="10"
                  width="2"
                  height="2"
                  fill="currentColor"
                  className="text-primary/40"
                />
                <rect
                  x="30"
                  y="25"
                  width="1"
                  height="1"
                  fill="currentColor"
                  className="text-primary/50"
                />
                <rect
                  x="70"
                  y="60"
                  width="3"
                  height="3"
                  fill="currentColor"
                  className="text-primary/40"
                />
                <rect
                  x="40"
                  y="80"
                  width="2"
                  height="2"
                  fill="currentColor"
                  className="text-primary/50"
                />
                <rect
                  x="80"
                  y="15"
                  width="1"
                  height="1"
                  fill="currentColor"
                  className="text-primary/40"
                />
                <rect
                  x="85"
                  y="85"
                  width="3"
                  height="3"
                  fill="currentColor"
                  className="text-primary/30"
                />
                <rect
                  x="20"
                  y="60"
                  width="2"
                  height="2"
                  fill="currentColor"
                  className="text-primary/45"
                />
                <rect
                  x="65"
                  y="35"
                  width="2"
                  height="2"
                  fill="currentColor"
                  className="text-primary/40"
                />
              </pattern>
            </defs>

            {/* Apply patterns */}
            <rect width="100%" height="100%" fill="url(#small-squares)" />
            <rect width="100%" height="100%" fill="url(#medium-squares)" />
            <rect width="100%" height="100%" fill="url(#large-squares)" />
            <rect width="100%" height="100%" fill="url(#scattered-squares)" />
          </svg>
        </div>

        {/* Angular squares overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <rect
              x="10"
              y="10"
              width="5"
              height="5"
              fill="currentColor"
              className="text-primary"
              transform="rotate(15)"
            />
            <rect
              x="25"
              y="20"
              width="4"
              height="4"
              fill="currentColor"
              className="text-primary"
              transform="rotate(30)"
            />
            <rect
              x="50"
              y="15"
              width="6"
              height="6"
              fill="currentColor"
              className="text-primary"
              transform="rotate(45)"
            />
            <rect
              x="75"
              y="25"
              width="3"
              height="3"
              fill="currentColor"
              className="text-primary"
              transform="rotate(60)"
            />
            <rect
              x="15"
              y="45"
              width="4"
              height="4"
              fill="currentColor"
              className="text-primary"
              transform="rotate(15)"
            />
            <rect
              x="35"
              y="55"
              width="5"
              height="5"
              fill="currentColor"
              className="text-primary"
              transform="rotate(30)"
            />
            <rect
              x="70"
              y="60"
              width="3"
              height="3"
              fill="currentColor"
              className="text-primary"
              transform="rotate(45)"
            />
            <rect
              x="20"
              y="80"
              width="6"
              height="6"
              fill="currentColor"
              className="text-primary"
              transform="rotate(20)"
            />
            <rect
              x="55"
              y="85"
              width="4"
              height="4"
              fill="currentColor"
              className="text-primary"
              transform="rotate(30)"
            />
            <rect
              x="85"
              y="75"
              width="5"
              height="5"
              fill="currentColor"
              className="text-primary"
              transform="rotate(15)"
            />
          </svg>
        </div>
      </div>

      {/* Hero Content */}
      <div className="container-custom relative z-10 pt-8 sm:pt-12 md:pt-16 lg:pt-14 pb-16 md:pb-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6 items-center">
          {/* Logo Column - Only visible on desktop (lg screens and up) */}
          <div className="relative hidden lg:block order-2">
            <div className="relative h-[500px] w-full flex items-center justify-center">
              {/* Decorative background elements for logo */}

              {/* Enhanced shadow elements for the logo - multiple layers for depth and realism */}
              {/* Shadow container with perspective effect */}
              <div
                className="absolute bottom-[-5px] w-full flex justify-center"
                style={{
                  perspective: "500px",
                  transformStyle: "preserve-3d",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              >
                <div
                  className="relative"
                  style={{
                    transform: "rotateX(65deg) scaleY(0.7)",
                    filter: "blur(1px)",
                  }}
                >
                  {/* Outermost shadow layer - very wide, diffused */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-35px] w-[500px] h-[90px] rounded-[50%] bg-blue-500/3 dark:bg-blue-500/5 blur-3xl animate-pulse-slow"></div>
                  {/* Secondary wide shadow layer */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-30px] w-[450px] h-[80px] rounded-[50%] bg-blue-500/5 dark:bg-blue-500/10 blur-3xl"></div>
                  {/* Medium shadow layer - more defined */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-25px] w-[380px] h-[60px] rounded-[50%] bg-blue-600/15 dark:bg-blue-600/20 blur-2xl"></div>
                  {/* Inner shadow layer - sharper, higher contrast */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-20px] w-[320px] h-[40px] rounded-[50%] bg-blue-700/20 dark:bg-blue-700/25 blur-xl"></div>
                  {/* Core shadow - most defined, creates the immediate shadow beneath object */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[-15px] w-[260px] h-[30px] rounded-[50%] bg-blue-800/25 dark:bg-blue-800/30 blur-md"></div>
                </div>
              </div>

              {/* Circular glowing background for logo */}
              <div className="absolute w-[350px] h-[350px] rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-xl"></div>
              <div
                className="absolute w-[470px] h-[470px] rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 animate-pulse"
                style={{ animationDuration: "4s" }}
              ></div>

              {/* Logo with 3D rotation */}
              <div className="relative z-10 animate-rotate-3d-object">
                <div className="w-[650px] h-[650px] relative">
                  <LogoSphere />
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div
              className="absolute top-20 left-14 h-24 w-24 rounded-full bg-blue-500/10 animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-24 right-16 h-32 w-32 rounded-full bg-blue-600/10 animate-float"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          {/* Text Column */}
          <div className="flex flex-col items-start order-1">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Best SAP S4 HANA Implementation Partner
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
              <span className="text-foreground">
                Transform Your Business with{" "}
              </span>
              <span className="text-blue-600 dark:text-blue-400">
                Atorix IT Solutions
              </span>
            </h1>

            {/* Mobile LogoSphere - Visible only on mobile and tablet (below lg screens) */}
            <div className="lg:hidden w-full my-6">
              <div className="relative h-[250px] sm:h-[300px] md:h-[350px] flex items-center justify-center">
                {/* Simplified shadow and glow effects for mobile */}
                <div className="absolute w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[260px] md:h-[260px] rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-xl"></div>
                <div
                  className="absolute w-[170px] h-[170px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 animate-pulse"
                  style={{ animationDuration: "4s" }}
                ></div>

                {/* Logo with 3D rotation - smaller size for mobile */}
                <div className="relative z-10 animate-rotate-3d-object">
                  <div className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] relative">
                    <LogoSphere />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8">
              Atorix IT Solutions delivers robust, business process solutions
              with unrivaled experience in SAP implementation, support, and
              integration services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <motion.div variants={itemVariants}>
                <Button
                  asChild
                  className="gap-2 px-6 py-5 text-sm font-medium bg-gradient-hero shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden group btn-3d"
                >
                  <Link href="/contact">
                    {/* Glow effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-white/30 to-primary/0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000"></span>

                    <span className="relative z-10 flex items-center">
                      Get Started
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      ></motion.div>
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-primary/20 hover:border-primary"
              >
                <Link href="/services">Our Services</Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center text-sm text-muted-foreground">
              <div className="flex -space-x-0 mr-2">
                <div className="h-8 w-8 rounded-full bg-primary-foreground border border-border flex items-center justify-center">
                  <span className="text-xs font-medium">100+</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary-foreground border border-border flex items-center justify-center">
                  <span className="text-xs font-medium">5★</span>
                </div>
              </div>
              <span>Trusted by 100+ businesses with 5-star ratings</span>
            </div>
          </div>
        </div>

        {/* Scroll Down Button */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <button
            id="scroll-down-button"
            aria-label="Scroll down"
            className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-sm font-medium mb-2">Scroll Down</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
