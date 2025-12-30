"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  AwardIcon,
  ClockIcon,
  CodeIcon,
  CoinsIcon,
  DatabaseIcon,
  LucideIcon,
  ServerIcon,
  SettingsIcon,
  ShieldIcon,
  UsersIcon,
  RocketIcon,
  SearchIcon,
  CloudIcon,
  GlobeIcon,
  PuzzleIcon
} from "lucide-react";

// Map of feature keywords to icons
const iconMap = {
  implementation: RocketIcon,
  migration: CloudIcon,
  support: UsersIcon,
  maintenance: SettingsIcon,
  security: ShieldIcon,
  integration: PuzzleIcon,
  optimization: CoinsIcon,
  performance: ClockIcon,
  monitoring: SearchIcon,
  development: CodeIcon,
  data: DatabaseIcon,
  award: AwardIcon,
  global: GlobeIcon,
  server: ServerIcon
};

// Find the most appropriate icon based on feature text
const findIconForFeature = (featureText) => {
  const lowercaseText = featureText.toLowerCase();

  // Find the keyword that appears in the feature text
  const matchedKeyword = Object.keys(iconMap).find(keyword =>
    lowercaseText.includes(keyword)
  );

  // Return the matched icon or a default icon
  return matchedKeyword ? iconMap[matchedKeyword] : SettingsIcon;
};

export default function FeatureShowcase({ features, className = "" }) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 ${className}`}>
      {features.map((feature, index) => {
        const Icon = findIconForFeature(feature);

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex gap-4 p-4 rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm"
          >
            <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">{feature}</h3>
              <p className="text-muted-foreground text-sm">
                Our experts ensure this feature is implemented with industry best practices to maximize your business value.
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
