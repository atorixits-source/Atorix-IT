import { motion } from "framer-motion";

// Card hover effects for FAQ section
export default function EnhancedFAQCard({ title, content, delay = 0 }) {
  return (
    <motion.div
      className="bg-card rounded-lg p-6 border border-border/40 hover:border-primary/30 transition-all duration-300"
      whileHover={{
        scale: 1.03,
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
        y: -5,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground">{content}</p>
    </motion.div>
  );
}
