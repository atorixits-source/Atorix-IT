"use client";

import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import data
import servicesData from "@/data/services.json";

// Import custom components
import DataScienceHero from "@/components/services/DataScienceHero";
import DataScienceBenefits from "@/components/services/DataScienceBenefits";
import DataWorkflowVisualization from "@/components/services/DataWorkflowVisualization";

export default function DataSciencePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Get data science category and services
  const dataScienceCategory = servicesData.categories.find(
    (category) => category.id === "data-science"
  );

  return (
    <>
      {/* Progress bar that shows scroll position */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <DataScienceHero />

      {/* Services Section */}
      <section id="data-science-services" className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-muted/10" />
        <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.03]" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Our Data Science Services</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Comprehensive solutions for every step of your data journey, from collection and processing to visualization and actionable insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dataScienceCategory.services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      fill
                      alt={service.name}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  </div>

                  <CardHeader className="px-6 pt-6 pb-2">
                    <CardTitle className="text-xl tracking-tight">
                      {service.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="px-6 pb-6">
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">{feature}</p>
                        </div>
                      ))}

                      {service.features.length > 3 && (
                        <p className="text-xs text-muted-foreground pl-6">
                          +{service.features.length - 3} more features
                        </p>
                      )}
                    </div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Button asChild className="w-full">
                        <Link
                          href={`/services/data-science/${service.id}`}
                        >
                          Learn More
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <DataScienceBenefits />

      {/* Workflow Visualization */}
      <DataWorkflowVisualization />

      {/* Industries Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Our data science solutions drive transformation across diverse sectors, tailored to each industry's unique challenges and opportunities.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: "Healthcare", icon: "/images/industries/healthcare.png" },
              { name: "Finance", icon: "/images/industries/finance.png" },
              { name: "Retail", icon: "/images/industries/retail.png" },
              { name: "Manufacturing", icon: "/images/industries/manufacture.png" },
              { name: "Logistics", icon: "/images/industries/logistics.png" },
              { name: "Energy", icon: "/images/industries/Energy.png" },
              { name: "Telecommunications", icon: "/images/industries/communication.png" },
              { name: "Education", icon: "/images/industries/education.png" },
            ].map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-muted/30 border border-border rounded-xl p-6 flex flex-col items-center text-center hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src={industry.icon}
                    fill
                    alt={industry.name}
                    className="object-contain"
                  />
                </div>
                <h3 className="font-medium">{industry.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden bg-muted/20">
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Unlock the Power of Your Data?
              </h2>

              <p className="text-xl text-muted-foreground mb-8">
                Partner with us to transform your raw data into strategic business advantages. Our expert team will guide you through every step of the journey.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/contact">Contact Our Data Science Team</Link>
                </Button>

                <Button asChild variant="outline" size="lg">
                  <Link href="/services">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Services
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </section>
    </>
  );
}
