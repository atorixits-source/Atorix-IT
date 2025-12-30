import { motion } from "framer-motion";
import PulsingMapDots from "./PulsingMapDots";

export default function MapSection() {
  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.02]"></div>
      <PulsingMapDots />

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold">Our Location</h2>
          <p className="text-muted-foreground mt-2">Find us on the map</p>
        </motion.div>

        <motion.div
          className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-border/40"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <iframe
            src="https://www.google.com/maps?q=18.588048051275003,73.78119014757031&hl=es;z=14&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Atorix IT Solutions Location"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}
