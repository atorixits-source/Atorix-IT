import { motion } from "framer-motion";

export default function ContactInfoItem({ icon: Icon, title, children }) {
  return (
    <motion.div
      className="flex items-start p-4 rounded-lg bg-background hover:bg-muted/20 transition-colors duration-300"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div
        className="p-3 rounded-full bg-primary/10 mr-4"
        whileHover={{
          scale: 1.1,
          backgroundColor: "var(--primary-20)",
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="h-5 w-5 text-primary" />
      </motion.div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        {children}
      </div>
    </motion.div>
  );
}
