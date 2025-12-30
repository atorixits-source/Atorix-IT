"use client";

import { motion } from "framer-motion";
import IndustryGridItem from "./IndustryGridItem";

export default function AllIndustriesGrid({ industries }) {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-primary/5"></div>
      <div className="absolute inset-0 bg-[url('/dots.png')] opacity-[0.02]"></div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary/90 to-primary/70">
            All Industries We Serve
          </h2>
          <p className="text-lg text-muted-foreground">
            Our SAP expertise spans across all major industries. Whatever your
            sector, we can help you implement, optimize, and support SAP
            solutions tailored to your specific needs.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {industries.map((industry) => (
            <IndustryGridItem key={industry.id} industry={industry} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
