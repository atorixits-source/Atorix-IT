"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DataScienceShowcase() {
  const [activeTab, setActiveTab] = useState("data-analytics");

  const services = [
    {
      id: "data-analytics",
      name: "Advanced Data Analytics",
      description:
        "Transform raw data into actionable insights with comprehensive statistical analysis and business intelligence.",
      icon: "/images/icons/data-visualization.svg",
      image: "/images/services/data-science/data-analytics-flow.jpg",
    },
    {
      id: "machine-learning",
      name: "Machine Learning Solutions",
      description:
        "Leverage AI-powered algorithms to identify patterns, make predictions, and automate decision-making processes.",
      icon: "/images/icons/machine-learning.svg",
      image: "/images/services/data-science/ai-ml-concept.jpg",
    },
    {
      id: "data-engineering",
      name: "Data Engineering & Architecture",
      description:
        "Build robust data pipelines and infrastructure to process, store, and manage your critical business information.",
      icon: "/images/icons/data-engineering.svg",
      image: "/images/services/data-science/streaming-data.jpg",
    },
    {
      id: "data-visualization",
      name: "Data Visualization & Dashboarding",
      description:
        "Create compelling visual narratives with interactive dashboards that make complex data easy to understand.",
      icon: "/images/icons/data-visualization.svg",
      image: "/images/services/data-science/data-visualization.jpg",
    },
    {
      id: "real-time-analytics",
      name: "Real-Time Analytics",
      description:
        "Process and analyze streaming data as it's generated for immediate insights and actions.",
      icon: "/images/icons/real-time-analytics.svg",
      image: "/images/services/data-science/streaming-data.jpg",
    },
  ];

  const activeService = services.find((service) => service.id === activeTab);

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 opacity-70" />
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.02]" />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => {
          const top = Math.floor(Math.random() * 100);
          const left = Math.floor(Math.random() * 100);
          const size = Math.floor(Math.random() * 4) + 1;
          const opacity = Math.random() * 0.1;
          const duration = 15 + Math.random() * 20;
          const delay = Math.random() * -15;

          return (
            <div
              key={i}
              className="absolute rounded-full bg-primary"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: opacity,
                animation: `float ${duration}s infinite ease-in-out ${delay}s`,
              }}
            />
          );
        })}
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <h2 className="text-3xl font-bold mb-4">Data Science Services</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Unlock the power of your data with our comprehensive data science solutions that transform raw information into strategic business advantages.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Service Selection Tabs */}
          <div className="lg:col-span-4">
            <div className="space-y-2">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  <button
                    onClick={() => setActiveTab(service.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                      activeTab === service.id
                        ? "bg-primary/10 border border-primary/30"
                        : "bg-muted/30 hover:bg-muted/50 border border-border"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div
                          className={`p-2 rounded-md ${
                            activeTab === service.id
                              ? "bg-primary/20"
                              : "bg-muted"
                          }`}
                        >
                          <Image
                            src={service.icon}
                            alt={service.name}
                            width={16}
                            height={16}
                            className={`w-4 h-4 ${
                              activeTab === service.id
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                      </div>
                      <div>
                        <h3
                          className={`font-medium mb-1 ${
                            activeTab === service.id
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {service.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </button>
                  {activeTab === service.id && (
                    <motion.div
                      className="absolute right-0 h-full top-0 w-1 bg-primary"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Service Details */}
          <div className="lg:col-span-8">
            {activeService && (
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-xl overflow-hidden border border-border bg-background/50 backdrop-blur-sm"
              >
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={activeService.image}
                    alt={activeService.name}
                    fill
                    className="object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-80" />
                </div>
                <div className="p-6 relative">
                  <h3 className="text-2xl font-bold mb-4">{activeService.name}</h3>
                  <p className="text-muted-foreground mb-6">
                    {activeService.description}
                  </p>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Button asChild>
                      <Link
                        href={`/services/data-science/${activeService.id}`}
                        className="inline-flex items-center"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 border-t-2 border-r-2 border-primary/30 rounded-tr-lg opacity-70" />
                <div className="absolute bottom-4 left-4 w-20 h-20 border-b-2 border-l-2 border-primary/30 rounded-bl-lg opacity-70" />
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/services/data-science" className="inline-flex items-center">
                Explore All Data Science Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
