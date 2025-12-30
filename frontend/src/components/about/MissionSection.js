"use client";

import { motion } from "framer-motion";
import { Target, Users, Award } from "lucide-react";

export default function MissionSection() {
  return (
    <section className="py-16 border-b border-border/60">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "var(--primary-20)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Target className="h-6 w-6 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground">
              To empower businesses with tailored SAP solutions that drive
              digital transformation, optimize operations, and deliver
              measurable business value.
            </p>
          </motion.div>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "var(--primary-20)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users className="h-6 w-6 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-semibold">Our Vision</h2>
            <p className="text-muted-foreground">
              To be the most trusted SAP partner, recognized for our technical
              excellence, industry insights, and commitment to client success.
            </p>
          </motion.div>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "var(--primary-20)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Award className="h-6 w-6 text-primary" />
            </motion.div>
            <h2 className="text-2xl font-semibold">Our Values</h2>
            <p className="text-muted-foreground">
              Excellence, integrity, innovation, and partnership are the core
              values that guide our work and relationships with clients,
              partners, and employees.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
