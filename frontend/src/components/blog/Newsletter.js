import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AnimatedBlobBackground from "./AnimatedBlobBackground";

export default function Newsletter() {
  return (
    <section className="py-16 md:py-24 relative">
      <AnimatedBlobBackground />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground mb-8">
            Stay updated with the latest SAP insights, trends, and best practices delivered straight to your inbox.
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md border border-input bg-background flex-grow focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
              <Button type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              By subscribing, you agree to our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>. You can unsubscribe at any time.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
