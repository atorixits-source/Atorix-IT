"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import IndustryCard from "./IndustryCard";
import IndustryFilter from "./IndustryFilter";

const IndustriesOverview = forwardRef(({
  industries,
  activeFilter,
  setActiveFilter,
  resetFilters,
}, ref) => {
  return (
    <section ref={ref} className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-muted/30 dark:bg-muted/10"></div>
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.03]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-80"></div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-primary/70">
            Browse Industries
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our industry-specific SAP solutions tailored to address
            the unique challenges and opportunities in your sector.
          </p>

          <IndustryFilter
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onReset={resetFilters}
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => (
            <IndustryCard
              key={industry.id}
              industry={industry}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

IndustriesOverview.displayName = "IndustriesOverview";

export default IndustriesOverview;
