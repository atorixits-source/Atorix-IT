"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Interactive filter component for industries
export default function IndustryFilter({ activeFilter, setActiveFilter, onReset }) {
  const filters = [
    { id: "all", label: "All Industries" },
    { id: "manufacturing", label: "Manufacturing" },
    { id: "services", label: "Services" },
    { id: "retail", label: "Retail & Consumer" },
    { id: "healthcare", label: "Healthcare & Life Sciences" },
    { id: "finance", label: "Finance & Banking" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {filters.map((filter) => (
        <motion.div
          key={filter.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.id)}
            className="rounded-full px-4 shadow-sm"
          >
            {filter.label}
          </Button>
        </motion.div>
      ))}
      {activeFilter !== "all" && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="rounded-full px-4 text-muted-foreground"
          >
            Reset
          </Button>
        </motion.div>
      )}
    </div>
  );
}
