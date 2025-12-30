"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Zap,
  Cpu,
  BarChart2,
  Target,
  Shield,
  Users,
  Search
} from "lucide-react";

export default function DataScienceBenefits() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const benefits = [
    {
      id: 1,
      title: "Data-Driven Decisions",
      description: "Transform gut feelings into strategic insights backed by empirical evidence.",
      icon: TrendingUp,
      color: "bg-blue-500/10",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/20",
    },
    {
      id: 2,
      title: "Operational Efficiency",
      description: "Identify bottlenecks and optimize processes through advanced analytics.",
      icon: Zap,
      color: "bg-green-500/10",
      textColor: "text-green-500",
      borderColor: "border-green-500/20",
    },
    {
      id: 3,
      title: "Predictive Capabilities",
      description: "Anticipate market trends and customer needs before they emerge.",
      icon: Cpu,
      color: "bg-violet-500/10",
      textColor: "text-violet-500",
      borderColor: "border-violet-500/20",
    },
    {
      id: 4,
      title: "Performance Tracking",
      description: "Monitor KPIs in real-time with intuitive dashboards and metrics.",
      icon: BarChart2,
      color: "bg-amber-500/10",
      textColor: "text-amber-500",
      borderColor: "border-amber-500/20",
    },
    {
      id: 5,
      title: "Strategic Advantage",
      description: "Gain competitive edge through data-driven innovation and foresight.",
      icon: Target,
      color: "bg-red-500/10",
      textColor: "text-red-500",
      borderColor: "border-red-500/20",
    },
    {
      id: 6,
      title: "Risk Mitigation",
      description: "Identify and address potential issues before they impact your business.",
      icon: Shield,
      color: "bg-cyan-500/10",
      textColor: "text-cyan-500",
      borderColor: "border-cyan-500/20",
    },
    {
      id: 7,
      title: "Customer Insights",
      description: "Understand behavior patterns to enhance customer experience and loyalty.",
      icon: Users,
      color: "bg-purple-500/10",
      textColor: "text-purple-500",
      borderColor: "border-purple-500/20",
    },
    {
      id: 8,
      title: "Hidden Opportunities",
      description: "Discover untapped market potential and revenue streams in your data.",
      icon: Search,
      color: "bg-indigo-500/10",
      textColor: "text-indigo-500",
      borderColor: "border-indigo-500/20",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-muted/20" />
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.03]" />

      {/* Content */}
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Benefits of Data Science</h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Leverage the power of data to transform your organization, drive innovation, and create sustainable competitive advantages.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              onHoverStart={() => setHoveredCard(benefit.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className={`relative overflow-hidden rounded-xl p-6 border ${benefit.borderColor} ${benefit.color} hover:shadow-lg transition-all duration-300`}
            >
              {/* Glowing effect on hover */}
              {hoveredCard === benefit.id && (
                <motion.div
                  layoutId="glowingEffect"
                  className="absolute inset-0 opacity-40 blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: `radial-gradient(circle at center, ${benefit.textColor.replace('text-', 'var(--')}) 0%, transparent 70%)`,
                    zIndex: -1
                  }}
                />
              )}

              <div className="flex flex-col h-full">
                <div className={`rounded-full p-3 w-fit ${benefit.color} mb-4`}>
                  <benefit.icon className={`h-6 w-6 ${benefit.textColor}`} />
                </div>

                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm grow">
                  {benefit.description}
                </p>

                {/* Animated underline on hover */}
                <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary to-primary/0 transition-all duration-700" />
              </div>

              {/* Decorative corner accent */}
              <div className={`absolute top-0 right-0 w-16 h-16 ${benefit.color} opacity-30 rounded-bl-full`} />
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <div className="flex justify-center mt-16">
          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  );
}
