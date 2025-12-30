"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function Testimonial({ testimonial }) {
  const { name, role, company, image, content, rating } = testimonial;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <Quote className="absolute -top-2 -left-2 text-primary/20 h-8 w-8" />
          <div className="relative border-2 border-primary/20 rounded-full h-16 w-16 overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={name}
                width={80}
                height={80}
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-primary/10 text-primary text-xl font-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground italic mb-4">"{content}"</p>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">
              {role}, {company}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
