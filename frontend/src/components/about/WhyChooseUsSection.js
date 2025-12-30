"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, BarChart } from "lucide-react";

export default function WhyChooseUsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative">
      {/* Dynamic 3D Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A Partner You Can Trust for SAP Excellence
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              With over a decade of experience implementing and supporting SAP
              solutions, we have built a reputation for technical excellence,
              industry knowledge, and customer satisfaction.
            </p>

            <div className="space-y-4">
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ x: 5 }}
              >
                <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium">Expert Team</h3>
                  <p className="text-muted-foreground">
                    Our consultants are certified SAP professionals with years
                    of hands-on implementation experience.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ x: 5 }}
              >
                <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium">Proven Methodology</h3>
                  <p className="text-muted-foreground">
                    Our implementation approach minimizes risk and ensures
                    successful outcomes, on time and within budget.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover={{ x: 5 }}
              >
                <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium">
                    Industry Specialization
                  </h3>
                  <p className="text-muted-foreground">
                    We have deep knowledge across multiple industries,
                    enabling us to deliver tailored solutions that address
                    specific business challenges.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ x: 5 }}
              >
                <CheckCircle2 className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-medium">
                    Customer Satisfaction
                  </h3>
                  <p className="text-muted-foreground">
                    Our 95% client retention rate speaks to our commitment to
                    building lasting partnerships based on trust and results.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 md:space-y-6">
                <motion.div
                  className="aspect-square relative overflow-hidden rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/images/web-developer.svg"
                    alt="SAP Consulting"
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <motion.div
                  className="aspect-square relative overflow-hidden rounded-lg shadow-md bg-primary/10 flex items-center justify-center"
                  whileHover={{ scale: 1.05, backgroundColor: "var(--primary-15)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <BarChart className="h-16 w-16 text-primary/80" />
                </motion.div>
              </div>
              <div className="space-y-4 md:space-y-6 mt-8 sm:mt-16">
                <motion.div
                  className="aspect-square relative overflow-hidden rounded-lg shadow-md bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CheckCircle2 className="h-16 w-16 text-primary/80" />
                </motion.div>
                <motion.div
                  className="aspect-square relative overflow-hidden rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="/images/consultation.svg"
                    alt="SAP Support"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
