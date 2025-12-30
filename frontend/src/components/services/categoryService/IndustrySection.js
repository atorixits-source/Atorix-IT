"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Industry data with icons
const industriesData = [
  {
    id: "manufacturing",
    name: "Manufacturing",
    description: "Streamline production processes and optimize supply chain management",
    icon: "/images/industries/manufacture.png"
  },
  {
    id: "retail",
    name: "Retail",
    description: "Enhance customer experience and inventory management",
    icon: "/images/industries/retail.png"
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Improve patient care and operational efficiency",
    icon: "/images/industries/healthcare.png"
  },
  {
    id: "finance",
    name: "Finance",
    description: "Enhance financial processes and regulatory compliance",
    icon: "/images/industries/finance.png"
  },
  {
    id: "education",
    name: "Education",
    description: "Optimize administrative processes and student services",
    icon: "/images/industries/education.png"
  },
  {
    id: "logistics",
    name: "Logistics",
    description: "Improve supply chain visibility and transportation management",
    icon: "/images/industries/logistics.png"
  },
  {
    id: "construction",
    name: "Construction",
    description: "Enhance project management and resource allocation",
    icon: "/images/industries/construction.png"
  },
  {
    id: "energy",
    name: "Energy",
    description: "Optimize energy production and distribution",
    icon: "/images/industries/Energy.png"
  },
  {
    id: "chemical",
    name: "Chemical",
    description: "Improve production processes and regulatory compliance",
    icon: "/images/industries/chemical.png"
  }
];

export default function IndustrySection({ relevantIndustries = null }) {
  const [hoveredIndustry, setHoveredIndustry] = useState(null);

  // If specific industries are provided, filter from the main list
  // Otherwise, show a subset of industries
  const industries = relevantIndustries
    ? industriesData.filter(ind => relevantIndustries.includes(ind.id))
    : industriesData.slice(0, 6);

  return (
    <div>
      <motion.h2
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Industries That Benefit
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {industries.map((industry, index) => (
          <motion.div
            key={industry.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              "relative p-4 border rounded-xl cursor-pointer group transition-all duration-300",
              hoveredIndustry === industry.id
                ? "border-primary/40 bg-primary/5 shadow-md"
                : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
            )}
            onMouseEnter={() => setHoveredIndustry(industry.id)}
            onMouseLeave={() => setHoveredIndustry(null)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center p-1.5">
                <Image
                  src={industry.icon}
                  alt={industry.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <h3 className="font-medium">{industry.name}</h3>
            </div>

            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: hoveredIndustry === industry.id ? 1 : 0,
                height: hoveredIndustry === industry.id ? "auto" : 0
              }}
              transition={{ duration: 0.2 }}
            >
              {industry.description}
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
