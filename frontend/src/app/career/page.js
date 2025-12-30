"use client";

import { useState } from "react";
import { jobPositions } from "@/data/jobPositions";
import HeroSection from "@/components/career/HeroSection";
import CoreValues from "@/components/career/CoreValues";
import WhyAtorix from "@/components/career/WhyAtorix";
import OpenPositions from "@/components/career/OpenPositions";
import CallToAction from "@/components/career/CallToAction";
import JobApplicationForm from "@/components/career/JobApplicationForm";

// Custom CSS for animations
const customStyles = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-spin-slow {
    animation: spin-slow 20s linear infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;

export default function CareerPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style jsx global>{customStyles}</style>
      
      <HeroSection />
      <CoreValues />
      <WhyAtorix />

      <section id="open-positions" className="py-20 bg-gradient-to-b from-background to-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OpenPositions 
            positions={jobPositions}
          />
        </div>
      </section>

      <CallToAction />

      {/* Job Application Form Section */}
      <section id="job-application" className="py-16 bg-gradient-to-b from-muted/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Ready to Join Our Team?
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              Fill out the form below to apply for a position at our company.
            </p>
          </div>
          <JobApplicationForm />
        </div>
      </section>
    </div>
  );
}
