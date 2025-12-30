"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import EnhancedServiceSectionPattern from "./EnhancedServiceSectionPattern";

export default function ServiceCategorySection({ category, index }) {
  return (
    <section
      key={category.id}
      id={`${category.id}-details`}
      className={`py-16 md:py-24 relative ${
        index % 2 === 1 ? "bg-background" : ""
      }`}
    >
      {/* Enhanced Background Pattern */}
      <EnhancedServiceSectionPattern index={index} />

      <div className="container-custom relative z-10">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Service Category
            </div>
            <h2 className="text-3xl font-bold mb-4">{category.name}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {category.description}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.services.map((service, serviceIndex) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: serviceIndex * 0.1 }}
            >
              <Card className="border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 h-full">
                <CardHeader className="p-6">
                  <CardTitle className="text-xl tracking-tight">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{feature}</p>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <p className="text-xs text-muted-foreground pl-6">
                        +{service.features.length - 3} more features
                      </p>
                    )}
                  </div>
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="mt-4"
                  >
                    <Button asChild className="w-full">
                      <Link
                        href={`/services/${category.id}/${service.id}`}
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
