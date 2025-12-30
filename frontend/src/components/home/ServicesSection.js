"use client";

import { useState } from "react";
import ServiceCard from "./ServiceCard";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import servicesData from "@/data/services.json";

// Map of service IDs to images for detail pages
const serviceImages = {
  "implementation-rollout": "/images/services/sap-implementation.jpg",
  "sap-ecc-s4-hana-support": "/images/services/sap-support.jpg",
  "sap-integration": "/images/services/sap-integration.png",
  "upgrade-services": "/images/services/sap-erp.jpg",
  "sap-s4-hana-migration": "/images/services/sap-cloud.png",
  "business-consulting": "/images/about/pt1.webp",
  "process-consulting": "/images/about/pt2.webp",
  "technology-consulting": "/images/about/pt3.webp",
  "sap-s4-hana-ecc": "/images/bg/services-bg.webp",
  "sap-business-one-addon": "/images/services/sap-implementation.webp",
  "cyber-security": "/images/about/pt4.webp",
  "dynamics-365": "/images/about/pt5.webp",
  // Default fallback image for other services
  "default": "/images/web-dev.svg"
};

// SVG icons for services cards
const serviceIcons = {
  // Implementation services
  "implementation-rollout": "/images/icons/implementation.svg",
  "sap-business-one-implementation": "/images/icons/implementation.svg",

  // Support services
  "sap-ecc-s4-hana-support": "/images/icons/support.svg",
  "sap-business-one-support": "/images/icons/support.svg",

  // Integration services
  "sap-integration": "/images/icons/integration.svg",

  // Upgrade and migration services
  "upgrade-services": "/images/app.svg",
  "sap-s4-hana-migration": "/images/icons/migration.svg",
  "sap-business-one-migration": "/images/icons/migration.svg",

  // Analytics services
  "sap-analytics": "/images/icons/analytics.svg",

  // Consulting services - now with unique icons
  "business-consulting": "/images/icons/consulting.svg",
  "process-consulting": "/images/icons/process-consulting.svg",
  "technology-consulting": "/images/icons/technology-consulting.svg",

  // Security services
  "cyber-security": "/images/consultation.svg",

  // Other services
  "discovery-evaluation": "/images/web-dev.svg",
  "sap-s4-hana-ecc": "/images/web.svg",
  "sap-s4-hana-cloud": "/images/hosting.svg",
  "sap-business-one-hana": "/images/web.svg",
  "sap-business-one-addon": "/images/web-dev.svg",
  "dynamics-365": "/images/web-dev.svg"
};

// Extract services from the services.json file and format them for display
const formattedServices = servicesData.categories.flatMap(category =>
  category.services.map(service => ({
    id: service.id,
    categoryId: category.id,
    title: service.name,
    description: service.description,
    icon: serviceIcons[service.id] || "/images/web.svg", // Default icon if not found
    // The image is stored for detail pages but not passed to ServiceCard
    detailImage: serviceImages[service.id] || serviceImages["default"],
    path: `/services/${category.id}/${service.id}`
  }))
);

export default function ServicesSection() {
  const [visibleServices, setVisibleServices] = useState(6);
  const [expandedGrid, setExpandedGrid] = useState(false);

  // Modified to update state for animation purposes
  const showMore = () => {
    setVisibleServices(formattedServices.length);
    // Add a small delay to trigger the animation
    setTimeout(() => {
      setExpandedGrid(true);
    }, 100);
  };

  // Animation variants
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

  const headerVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-muted relative overflow-hidden bg-grid-pattern">
      {/* Decorative background elements */}
      <motion.div
        className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
      <motion.div
        className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      ></motion.div>

      {/* 3D floating elements - simplified animation */}
      <div className="absolute top-1/4 left-1/4 w-24 h-24 opacity-20 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-xl"
          animate={{
            rotateX: [0, 25, 0],
            rotateY: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        ></motion.div>
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-16 h-16 opacity-20 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-full"
          animate={{
            rotateX: [0, -15, 0],
            rotateY: [0, 25, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        ></motion.div>
      </div>

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
          variants={headerVariants}
        >
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            What We Offer
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            Comprehensive SAP Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We provide a complete range of SAP services to help your business
            thrive in the digital economy.
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formattedServices.slice(0, visibleServices).map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="h-full"
              initial={index >= 6 && !expandedGrid ? { opacity: 0, y: 20 } : false}
              animate={index >= 6 && expandedGrid ? { opacity: 1, y: 0 } : false}
              transition={{
                delay: index >= 6 ? (index - 6) * 0.1 : 0,
                duration: 0.5
              }}
            >
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                delay={index * 100}
                className="h-full"
                href={service.path}
              />
            </motion.div>
          ))}
        </div>

        {/* Show more button */}
        {visibleServices < formattedServices.length && (
          <motion.div
            className="mt-12 text-center"
            variants={itemVariants}
          >
            <Button
              onClick={showMore}
              variant="outline"
              size="lg"
              className="gap-2 btn-3d"
            >
              Show More Services
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* View all services link */}
        <motion.div
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <Button
            asChild
            size="lg"
            className="gap-2 bg-gradient-hero text-white shadow-lg hover:shadow-xl transition-shadow btn-3d"
          >
            <Link href="/services">
              View All Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
