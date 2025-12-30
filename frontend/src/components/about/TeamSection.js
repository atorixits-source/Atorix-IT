"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedBlobBackground from "./AnimatedBlobBackground";

export default function TeamSection() {
  // Team members data
  const teamMembers = [
    {
      name: "Nitedra Singh",
      position: "Director",
      image: "/images/about/nitedra-singh.jpg",
    },
  ];

  return (
    <section className="py-16 md:py-24 relative">
      <AnimatedBlobBackground />
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
            Meet Our Leadership
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            The Expert Behind Our Success
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Our leadership brings extensive experience in SAP implementation, consulting, and support.
            We're passionate about helping businesses leverage technology to drive growth.
          </p>
        </motion.div>

        <div className="flex justify-center">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="group max-w-md transform transition-all duration-300 hover:-translate-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-card border border-border/40 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:border-primary/30">
                <motion.div
                  className="relative overflow-hidden rounded-xl mb-6 aspect-square w-full max-w-sm mx-auto"
                  whileHover={{ scale: 1.02 }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium text-lg mb-4">{member.position}</p>
                  <p className="text-muted-foreground">
                    Leading our team with vision and expertise, driving our mission to deliver exceptional
                    SAP solutions that transform businesses.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
