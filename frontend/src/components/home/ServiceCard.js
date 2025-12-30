"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { motion } from "framer-motion";

export default function ServiceCard({ icon, title, description, delay = 0, href = "/services", className = "" }) {
  const { resolvedTheme } = useTheme();

  return (
    <Card
      className={`group overflow-hidden border-border/40 transition-all duration-300 hover:border-primary/30 hover:shadow-md dark:bg-background/30 relative h-full ${className}`}
    >
      {/* 3D hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>

      {/* Gradient border on hover */}
      <div className="absolute inset-0 p-[1px] rounded-lg bg-gradient-to-tr from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <CardHeader className="p-6 relative z-10">
        {icon && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay * 0.0015, duration: 0.5, type: "spring" }}
            whileHover={{
              scale: 1.1,
              rotate: [0, 5, 0, -5, 0],
              transition: { duration: 0.5 }
            }}
            className="mb-4 rounded-lg bg-primary/10 p-3 w-fit transition-colors duration-300 group-hover:bg-primary/20 relative"
          >
            {/* Inner glow effect */}
            <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <Image
                src={icon}
                alt={title}
                width={60}
                height={60}
                className={`h-10 w-10 md:h-14 md:w-14 object-contain service-icon ${
                  resolvedTheme === 'dark'
                    ? 'brightness-125 contrast-110 filter-invert-25'
                    : 'bg-white rounded-sm'
                } transition-all duration-300 group-hover:filter-none`}
                style={{
                  filter: resolvedTheme === 'dark' ? 'invert(0.1) brightness(1.2)' : 'none'
                }}
                unoptimized
              />
            </div>
          </motion.div>
        )}
        <CardTitle className="text-xl tracking-tight text-3d group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-4 text-muted-foreground relative z-10">
        <p className="transition-colors duration-300 group-hover:text-foreground">{description}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-2 relative z-10">
        <Button variant="link" asChild className="p-0 h-auto text-primary font-medium group-hover:font-semibold transition-all duration-300">
          <Link href={href} className="group-hover:underline flex items-center gap-1">
            Learn more
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.div>
          </Link>
        </Button>
      </CardFooter>

      {/* Inner shadow */}
      <div className="absolute inset-0 rounded-lg shadow-inner pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
    </Card>
  );
}
