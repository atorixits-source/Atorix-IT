"use client";

import HeroSection from "@/components/home/HeroSection";
import ClientsSection from "@/components/home/ClientsSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import IndustriesSection from "@/components/home/IndustriesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ClientsSection />
      <ServicesSection />
      <FeaturesSection />
      <IndustriesSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
