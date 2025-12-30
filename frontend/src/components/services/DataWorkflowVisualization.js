"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Database,
  FileText,
  RefreshCw,
  LineChart,
  PieChart,
  Lightbulb,
  CheckSquare
} from "lucide-react";

export default function DataWorkflowVisualization() {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-advance steps when not being hovered
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const steps = [
    {
      id: 0,
      title: "Data Collection",
      description: "Gather data from multiple sources including databases, APIs, files, and IoT devices.",
      icon: Database,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      id: 1,
      title: "Data Preparation",
      description: "Clean, transform, and structure data for analysis. Handle missing values and outliers.",
      icon: FileText,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      id: 2,
      title: "Processing & Analysis",
      description: "Apply statistical methods and algorithms to extract patterns and relationships.",
      icon: RefreshCw,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      id: 3,
      title: "Modeling & Prediction",
      description: "Develop machine learning models to make predictions and generate forecasts.",
      icon: LineChart,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      id: 4,
      title: "Visualization",
      description: "Create intuitive dashboards and visual representations of insights for stakeholders.",
      icon: PieChart,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      id: 5,
      title: "Insight Generation",
      description: "Transform analysis results into actionable business recommendations.",
      icon: Lightbulb,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
    {
      id: 6,
      title: "Implementation",
      description: "Put insights into action through operational changes and strategic initiatives.",
      icon: CheckSquare,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/10" />
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.03]" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Data Science Workflow</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            See how we transform raw data into actionable insights through our comprehensive data science process.
          </p>
        </motion.div>

        <div
          className="max-w-5xl mx-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Workflow Visualization */}
          <div className="mb-16 relative">
            {/* Connecting line */}
            <div className="absolute top-12 left-0 w-full h-1 bg-muted rounded-full" />

            {/* Steps */}
            <div className="flex justify-between relative">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="relative z-10 flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveStep(index)}
                >
                  <motion.div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 cursor-pointer transition-colors duration-300 ${
                      activeStep === index ? step.bgColor : "bg-muted"
                    } border ${
                      activeStep === index ? step.borderColor : "border-muted-foreground/20"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Dynamically rendered icon */}
                    {React.createElement(step.icon, {
                      className: `h-6 w-6 ${
                        activeStep === index ? step.color : "text-muted-foreground"
                      }`,
                    })}
                  </motion.div>

                  <p
                    className={`text-xs font-medium transition-colors duration-300 text-center w-16 ${
                      activeStep === index ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>

                  {/* Active Step Indicator */}
                  {activeStep === index && (
                    <motion.div
                      layoutId="activeStepIndicator"
                      className={`absolute -bottom-1 w-4 h-1 rounded-full ${step.color.replace('text-', 'bg-')}`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Step Details */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`p-8 rounded-xl ${steps[activeStep].bgColor} border ${steps[activeStep].borderColor} relative overflow-hidden`}
          >
            {/* Background Patterns */}
            <div className="absolute right-0 bottom-0 w-64 h-64 opacity-10">
              <div className="w-full h-full bg-grid-pattern opacity-40 rotate-12" />
            </div>

            <div className="flex items-start md:items-center gap-6 md:gap-10 flex-col md:flex-row">
              <div className={`rounded-full p-5 ${steps[activeStep].bgColor} border ${steps[activeStep].borderColor}`}>
                {/* Dynamically rendered icon for step details */}
                {React.createElement(steps[activeStep].icon, {
                  className: `h-10 w-10 ${steps[activeStep].color}`,
                })}
              </div>

              <div className="flex-1">
                <h3 className={`text-2xl font-bold mb-3 ${steps[activeStep].color}`}>
                  {steps[activeStep].title}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {steps[activeStep].description}
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 opacity-30">
              <div className={`absolute right-0 top-0 w-16 h-16 rounded-bl-full ${steps[activeStep].color.replace('text-', 'bg-')}`} />
            </div>
          </motion.div>

          {/* Navigation Dots for Mobile */}
          <div className="flex justify-center mt-8 gap-2 md:hidden">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  activeStep === index
                    ? steps[activeStep].color.replace('text-', 'bg-')
                    : 'bg-muted-foreground/30'
                }`}
                aria-label={`Go to step ${step.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
