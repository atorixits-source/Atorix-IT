"use client";
 
import { motion, useScroll, useSpring } from "framer-motion";
import servicesData from "@/data/services.json";
 
// Import modular components
import HeroSection from "@/components/services/HeroSection";
import CategoriesOverview from "@/components/services/CategoriesOverview";
import ServiceCategorySection from "@/components/services/ServiceCategorySection";
import ServiceCtaSection from "@/components/services/ServiceCtaSection";
import DataScienceShowcase from "@/components/services/DataScienceShowcase";
 
export default function ServicesPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
 
  return (
<>
      {/* Progress bar that shows scroll position */}
<motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />
 
      {/* Hero Section */}
<HeroSection />
 
      {/* Categories Overview */}
<CategoriesOverview />
 
      {/* Data Science Showcase - Special Feature Section */}
<DataScienceShowcase />
 
      {/* Detailed Category Sections */}
<div className="bg-muted/20">
        {servicesData.categories.map((category, index) => (
<ServiceCategorySection
            key={category.id}
            category={category}
            index={index}
          />
        ))}
</div>
 
      {/* CTA Section */}
<ServiceCtaSection />
</>
  );
}