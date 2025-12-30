"use client";

import { useScroll, useSpring, motion } from "framer-motion";

// Import modular components
import AboutHeroSection from "@/components/about/HeroSection";
import MissionSection from "@/components/about/MissionSection";
import WhyChooseUsSection from "@/components/about/WhyChooseUsSection";
import TeamSection from "@/components/about/TeamSection";
import GlobalPresenceSection from "@/components/about/GlobalPresenceSection";
import CtaSection from "@/components/about/CtaSection";

export default function AboutPage() {
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
      <AboutHeroSection />

      {/* Mission, Vision, Values Section */}
      <MissionSection />

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* Our Team */}
      <TeamSection />

      {/* Global Presence */}
      <GlobalPresenceSection />

      {/* CTA Section with Enhanced Animation */}
      <CtaSection />
    </>
  );
}
