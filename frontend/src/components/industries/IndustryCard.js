"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Enhanced Industry card component with animations for overview section
export default function IndustryCard({ industry, index }) {
  const { id, name, icon: Icon, description } = industry;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }} // Lower threshold for faster appearance
      transition={{ duration: 0.3, delay: index * 0.05 }} // Much faster animations
    >
      <Card className="industry-card h-full border-border/50 dark:bg-background/50 backdrop-blur-sm hover:border-primary/40 hover:shadow-xl transition-all duration-300 group">
        <CardHeader className="p-6">
          <div className="industry-icon w-16 h-16 rounded-lg bg-primary/5 dark:bg-primary/10 text-primary/70 dark:text-primary/80 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-300">
            <Icon
              size={32}
              className="group-hover:scale-110 transition-all duration-300"
            />
          </div>
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <p className="text-muted-foreground mb-4">{description}</p>
          <Link
            href={`#${id}`}
            className="industry-link text-primary font-medium flex items-center group-hover:text-primary/90"
          >
            Learn more
            <motion.div
              className="ml-1"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
