import { motion } from "framer-motion";
import EnhancedFAQCard from "./EnhancedFAQCard";

export default function FAQSection() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/20"></div>

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Here are some common questions about our services. If you don't
            find what you're looking for, feel free to contact us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <EnhancedFAQCard
            title="What SAP services do you offer?"
            content="We offer a full range of SAP services including implementation, support, integration, migration, upgrade, and specialized consulting for specific industries."
            delay={0.1}
          />

          <EnhancedFAQCard
            title="How long does an SAP implementation take?"
            content="Implementation timelines vary based on project scope, but typically range from 3-12 months. We use accelerated methodologies to minimize disruption."
            delay={0.2}
          />

          <EnhancedFAQCard
            title="Do you provide post-implementation support?"
            content="Yes, we offer comprehensive post-implementation support services to ensure your SAP systems continue to run smoothly and efficiently."
            delay={0.3}
          />

          <EnhancedFAQCard
            title="What industries do you specialize in?"
            content="We have expertise across multiple industries including manufacturing, healthcare, retail, finance, energy, and more. Our solutions are tailored to specific industry needs."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
