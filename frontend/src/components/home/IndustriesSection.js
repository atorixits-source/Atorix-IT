"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Car,
  Stethoscope,
  ShoppingBag,
  Factory,
  Zap,
  Landmark,
  Phone,
  Rocket,
  Truck,
  Film,
  Pill,
  Building2,
  Utensils,
  Ship,
  BarChart2,
  Beaker,
  Bed,
  Wheat,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Industry data with icons from Lucide
const industriesData = [
  {
    title: "Automotive",
    icon: Car,
    description:
      "Solutions for vehicle manufacturing, supply chain, and dealership operations.",
  },
  {
    title: "Healthcare",
    icon: Stethoscope,
    description:
      "Streamlining patient care, medical records, and healthcare resource management.",
  },
  {
    title: "Retail",
    icon: ShoppingBag,
    description:
      "Optimizing inventory, customer experience, and omnichannel retail operations.",
  },
  {
    title: "Manufacturing",
    icon: Factory,
    description:
      "Enhancing production efficiency, quality control, and supply chain visibility.",
  },
  {
    title: "Energy",
    icon: Zap,
    description:
      "Managing utilities, renewable resources, and energy distribution networks.",
  },
  {
    title: "Financial Services",
    icon: Landmark,
    description:
      "Solutions for banking, investment management, and financial compliance.",
  },
  {
    title: "Telecommunications",
    icon: Phone,
    description:
      "Supporting network operations, customer service, and telecom infrastructure.",
  },
  {
    title: "Aerospace & Defense",
    icon: Rocket,
    description:
      "Managing complex projects, compliance, and defense contract requirements.",
  },
  {
    title: "Transportation & Logistics",
    icon: Truck,
    description:
      "Optimizing fleet management, routing, and supply chain logistics.",
  },
  {
    title: "Media & Entertainment",
    icon: Film,
    description:
      "Content management, distribution, and audience analytics solutions.",
  },
  {
    title: "Pharmaceuticals",
    icon: Pill,
    description:
      "Supporting R&D, compliance, and pharmaceutical supply chain management.",
  },
  {
    title: "Construction",
    icon: Building2,
    description:
      "Project management, equipment tracking, and construction resource planning.",
  },
];

export default function EnhancedIndustriesSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Animation variants for section elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

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

  // Floating blob animations for background
  const floatingBlob1 = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 0.15,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-muted">
      {/* Dynamic animated background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5 pointer-events-none" />

      {/* Floating blobs */}
      <motion.div
        variants={floatingBlob1}
        initial="hidden"
        animate="visible"
        className="absolute top-0 left-1/4 -translate-x-1/2 shape-blob w-[400px] h-[400px] bg-primary/5 blur-3xl opacity-30 dark:opacity-20 pointer-events-none"
      />
      <motion.div
        variants={floatingBlob1}
        initial="hidden"
        animate="visible"
        className="absolute bottom-0 right-1/4 translate-x-1/2 shape-blob2 w-[500px] h-[500px] bg-primary/5 blur-3xl opacity-30 dark:opacity-20 pointer-events-none"
      />

      {/* Animated geometric decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute -right-[10%] top-[10%] w-[300px] h-[300px] opacity-10"
        >
          <motion.div
            animate={{
              rotateZ: [0, 360],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
            className="w-full h-full border-2 border-primary/30 rounded-3xl"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="absolute -left-[5%] bottom-[20%] w-[200px] h-[200px] opacity-10"
        >
          <motion.div
            animate={{
              rotateZ: [360, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 15,
              ease: "linear",
              repeat: Infinity,
            }}
            className="w-full h-full border-2 border-primary/30 rounded-full"
          />
        </motion.div>
      </div>

      <motion.div
        className="container mx-auto px-4 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        {/* Section header with 3D text effect */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4 backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Industries We Serve
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6"
          >
            Industry-Specific Solutions
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            We deliver tailored SAP solutions for diverse industries, empowering
            businesses to overcome unique challenges and drive innovation.
          </motion.p>
        </div>

        {/* Industries grid with enhanced 3D effects - Only showing 12 fixed items */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 perspective"
        >
          {industriesData.map((industry, index) => (
            <IndustryCard
              key={industry.title + index}
              industry={industry}
              index={index}
              isHovered={hoveredIndex === index}
              setHoveredIndex={setHoveredIndex}
              currentIndex={index}
            />
          ))}
        </motion.div>

        {/* Enhanced CTA button with glowing effect */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            className="gap-2 px-8 py-6 text-lg font-medium bg-gradient-hero shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden group btn-3d"
          >
            <Link href="/industries">
              {/* Glow effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-white/30 to-primary/0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000"></span>

              <span className="relative z-10 flex items-center">
                Explore All Industries
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ArrowRight className="h-5 w-5 ml-2" />
                </motion.div>
              </span>
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Enhanced 3D Industry Card Component
function IndustryCard({ industry, index, isHovered, setHoveredIndex, currentIndex }) {
  // Animation states
  const [rotateXValue, setRotateXValue] = useState(0);
  const [rotateYValue, setRotateYValue] = useState(0);
  const [scaleValue, setScaleValue] = useState(1);

  // Animation variants for card entry with staggered effect
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * (i % 4), // Stagger effect based on column position
        duration: 0.5,
        type: "spring",
        stiffness: 50,
        damping: 10
      },
    }),
  };

  const IconComponent = industry.icon;

  // Handle mouse movement for the 3D effect
  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    // Scale the effect down to avoid extreme rotations
    setRotateXValue(mouseY / 25 * -1); // Reversed for natural tilt
    setRotateYValue(mouseX / 25);
  };

  const handleMouseEnter = () => {
    setHoveredIndex(currentIndex);
    setScaleValue(1.05);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setRotateXValue(0);
    setRotateYValue(0);
    setScaleValue(1);
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="relative perspective"
      style={{
        transform: "perspective(1000px)",
      }}
      whileHover={{
        z: 10,
      }}
    >
      <motion.div
        className="industry-card h-full rounded-xl p-6 border border-border/40 bg-background/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 dark:bg-background/30 dark:hover:bg-background/40 group overflow-hidden"
        style={{
          transform: `rotateX(${rotateXValue}deg) rotateY(${rotateYValue}deg) scale(${scaleValue})`,
          transition: "transform 0.2s ease-out",
          boxShadow: isHovered ? "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 0 15px rgba(0, 0, 0, 0.05)" : "none",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient overlay effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* Inner content with 3D effect */}
        <div className="flex flex-col h-full relative z-10">
          {/* Icon with 3D pop and glow effect */}
          <div
            className="mb-4"
            style={{
              transform: isHovered ? "translateZ(20px)" : "translateZ(0)",
              transition: "transform 0.3s ease-out"
            }}
          >
            <motion.div
              className="industry-icon w-14 h-14 rounded-lg flex items-center justify-center bg-primary/5 dark:bg-primary/10 text-primary/70 dark:text-primary/80 transition-all duration-300 group-hover:bg-primary/15 relative"
              whileHover={{
                scale: 1.15,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.5 }
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <IconComponent className="w-7 h-7" />
              </div>
            </motion.div>
          </div>

          {/* Title with 3D effect */}
          <h3
            className="text-lg font-medium mb-2 text-foreground text-3d group-hover:text-primary transition-colors duration-300"
            style={{
              transform: isHovered ? "translateZ(15px)" : "translateZ(0)",
              transition: "transform 0.3s ease-out"
            }}
          >
            {industry.title}
          </h3>

          {/* Description with 3D effect */}
          <p
            className="text-muted-foreground text-sm mb-4 flex-grow group-hover:text-foreground/80 transition-colors duration-300"
            style={{
              transform: isHovered ? "translateZ(10px)" : "translateZ(0)",
              transition: "transform 0.4s ease-out"
            }}
          >
            {industry.description}
          </p>

          {/* Learn more link with 3D effect */}
          <div
            style={{
              transform: isHovered ? "translateZ(25px)" : "translateZ(0)",
              transition: "transform 0.3s ease-out"
            }}
          >
            <Link
              href={`/industries`}
              className="industry-link inline-flex items-center text-primary text-sm font-medium transition-all duration-200 group-hover:font-semibold"
            >
              <span>Learn more</span>
              <motion.span
                className="ml-1"
                animate={isHovered ? { x: 5 } : { x: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="h-3 w-3" />
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
