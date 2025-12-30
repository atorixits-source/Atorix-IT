"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function GlobalPresenceSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Global Presence
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Serving Clients Around the World
          </h2>
          <p className="text-lg text-muted-foreground">
            With offices in key locations and a team of remote experts, we
            provide localized support with global capabilities to businesses
            of all sizes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-card rounded-xl p-6 shadow-sm border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{
              y: -10,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              borderColor: "var(--primary-40)"
            }}
          >
            <div className="flex items-center mb-4">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MapPin className="h-6 w-6 text-primary mr-3" />
              </motion.div>
              <h3 className="text-xl font-semibold">India</h3>
            </div>
            <p className="text-muted-foreground mb-3">
              Office #101, First Floor, Sai Square IT Park, Cochin, India,
              682037
            </p>
            <p className="text-muted-foreground">Phone: +91 98765 43210</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-xl p-6 shadow-sm border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{
              y: -10,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              borderColor: "var(--primary-40)"
            }}
          >
            <div className="flex items-center mb-4">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MapPin className="h-6 w-6 text-primary mr-3" />
              </motion.div>
              <h3 className="text-xl font-semibold">United States</h3>
            </div>
            <p className="text-muted-foreground mb-3">
              350 Tech Square, Suite 200, Boston, MA 02139, USA
            </p>
            <p className="text-muted-foreground">Phone: +1 (555) 123-4567</p>
          </motion.div>

          <motion.div
            className="bg-card rounded-xl p-6 shadow-sm border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{
              y: -10,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              borderColor: "var(--primary-40)"
            }}
          >
            <div className="flex items-center mb-4">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MapPin className="h-6 w-6 text-primary mr-3" />
              </motion.div>
              <h3 className="text-xl font-semibold">Germany</h3>
            </div>
            <p className="text-muted-foreground mb-3">
              Hauptstraße 78, 10117 Berlin, Germany
            </p>
            <p className="text-muted-foreground">Phone: +49 30 12345678</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
