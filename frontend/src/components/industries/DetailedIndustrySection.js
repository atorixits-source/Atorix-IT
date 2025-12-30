"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

// Detailed Industry Section Component with static/sticky background
export default function DetailedIndustrySection({ industry, index }) {
  const IconComponent = industry.icon;
  const canvasRef = useRef(null);

  // For canvas-based animated background
  useEffect(() => {
    if (index % 2 === 0) return; // Only add canvas effects to alternate sections

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;

    // Create connected nodes effect
    const nodes = [];
    const connections = [];
    const nodeCount = 50;
    const connectionDistance = 100;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;

      // Reset nodes
      nodes.length = 0;
      connections.length = 0;

      // Create nodes
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    const connectNodes = () => {
      connections.length = 0;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            connections.push({
              from: i,
              to: j,
              opacity: 1 - distance / connectionDistance,
            });
          }
        }
      }
    };

    const drawNodes = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      connections.forEach(conn => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = `rgba(100, 100, 255, ${conn.opacity * 0.65})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 150, 136, 0.5)';
        ctx.fill();
      });
    };

    const animate = () => {
      // Move nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      connectNodes();
      drawNodes();

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [index]);

  return (
    <section
      id={industry.id}
      className="py-16 md:py-24 relative overflow-hidden scroll-mt-20"
    >
      {/* Static background with different styles based on index */}
      <div className="absolute inset-0 w-full h-full">
        <div className="fixed top-0 left-0 w-full h-screen -z-10 opacity-50">
          {index % 2 === 0 ? (
            // Even sections - gradient background
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
              <div className="absolute inset-0 bg-[url('/dots.png')] opacity-[0.02]"></div>
            </div>
          ) : (
            // Odd sections - canvas background
            <div className="absolute inset-0">
              <canvas ref={canvasRef} className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500/5 to-transparent"></div>
            </div>
          )}
        </div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={index % 2 === 1 ? "order-2" : "order-1"}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                Industry Solutions
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                {industry.name}
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                {industry.description}
              </p>
            </motion.div>

            {/* Industry Challenges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <h3 className="text-xl font-semibold mb-4">Key Challenges</h3>
              <div className="space-y-2 mb-8">
                {industry.challenges.map((challenge, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.15, delay: 0.03 * i }}
                  >
                    <div className="bg-primary/10 p-1 rounded-full mr-3 flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <p>{challenge}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Industry Solutions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4">Our Solutions</h3>
              <div className="space-y-2 mb-8">
                {industry.solutions.map((solution, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.15, delay: 0.03 * i }}
                  >
                    <div className="bg-primary/10 p-1 rounded-full mr-3 flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <p>{solution}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Button
                asChild
                size="lg"
                className="gap-2 mt-4 shadow-lg hover:shadow-xl"
              >
                <Link href="/contact">
                  Discuss Your Requirements
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            className={index % 2 === 1 ? "order-1" : "order-2"}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-border/40 bg-card aspect-square flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-70"></div>
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
              <div className="relative z-10 flex flex-col items-center justify-center">
                <motion.div
                  className="w-48 h-48 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent
                    size={120}
                    className="text-primary drop-shadow-md"
                  />
                </motion.div>
                <h3 className="text-2xl font-bold text-center">
                  {industry.name}
                </h3>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
