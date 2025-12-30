"use client";

import {
  Settings,
  Users,
  BarChart3,
  Clock,
  ShieldCheck,
  Globe2,
  Workflow,
  HeartHandshake
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// Features data
const features = [
  {
    icon: <Settings className="h-8 w-8 text-primary" />,
    title: "Customized Solutions",
    description: "We tailor SAP implementations to your specific business needs, ensuring you get maximum value from your investment."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Expert Team",
    description: "Our certified SAP consultants bring years of experience across industries to solve your most complex challenges."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "Data Analytics",
    description: "Transform your data into actionable insights with our advanced SAP analytics and reporting solutions."
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Faster Implementation",
    description: "Our accelerated implementation methodology reduces project timelines and gets you up and running quickly."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Secure Systems",
    description: "We build robust security protocols into every implementation to protect your valuable business data."
  },
  {
    icon: <Globe2 className="h-8 w-8 text-primary" />,
    title: "Global Support",
    description: "Round-the-clock support for your SAP systems from our team of experts located around the world."
  },
  {
    icon: <Workflow className="h-8 w-8 text-primary" />,
    title: "Process Optimization",
    description: "We streamline your business processes through intelligent automation and SAP best practices."
  },
  {
    icon: <HeartHandshake className="h-8 w-8 text-primary" />,
    title: "Long-Term Partnership",
    description: "We're committed to your success beyond implementation with ongoing support and strategic guidance."
  }
];

// Feature Card Component
function FeatureCard({ icon, title, description, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }}
      whileHover={{
        y: -10,
        transition: { duration: 0.3 }
      }}
      className="relative perspective"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="group p-6 rounded-xl dark:bg-background/60 border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-500 h-full backdrop-blur-sm relative overflow-hidden"
        animate={{
          rotateX: isHovered ? 5 : 0,
          rotateY: isHovered ? 5 : 0,
          z: isHovered ? 10 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15
        }}
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        {/* Border highlight */}
        <div className="absolute inset-0 rounded-xl border border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

        {/* Icon container with 3D pop and glow effect */}
        <motion.div
          className="p-3 bg-primary/10 rounded-lg w-fit mb-4 group-hover:bg-primary/20 transition-colors duration-300 relative"
          whileHover={{
            scale: 1.1,
            rotateZ: [0, -5, 5, 0],
            transition: { duration: 0.5 }
          }}
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-lg bg-primary/30 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>

          {/* Icon with animation */}
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? [0, 10, -10, 0] : 0
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              times: [0, 0.3, 0.6, 1]
            }}
            className="relative z-10"
          >
            {icon}
          </motion.div>
        </motion.div>

        {/* Content with animations */}
        <motion.h3
          className="text-xl font-semibold mb-2 text-3d group-hover:text-primary transition-colors duration-300"
          animate={{
            x: isHovered ? 3 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300"
          animate={{
            x: isHovered ? 5 : 0,
            opacity: isHovered ? 1 : 0.9
          }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {description}
        </motion.p>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Dynamic background effects */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 rounded-full blur-3xl opacity-70 pointer-events-none"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"></div>

      {/* Floating decoration elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 rounded-full border border-primary/10 opacity-10 pointer-events-none"
        animate={{
          y: [-10, 10, -10],
          x: [5, -5, 5],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      ></motion.div>
      <motion.div
        className="absolute bottom-40 left-20 w-20 h-20 rounded-md border border-primary/10 opacity-10 pointer-events-none"
        animate={{
          y: [10, -10, 10],
          x: [-5, 5, -5],
          rotate: [0, -180, -360]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      ></motion.div>

      <motion.div
        className="container-custom relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        {/* Section header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          variants={itemVariants}
        >
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Why Choose Us
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            Our Capabilities
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We combine deep SAP expertise with innovation to deliver solutions that
            drive business transformation and create lasting value.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
