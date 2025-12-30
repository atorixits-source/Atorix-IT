import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import ContactInfoItem from "./ContactInfoItem";

export default function ContactInfo() {
  return (
    <motion.div
      className="lg:col-span-1 space-y-8"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      <div>
        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
        <p className="text-muted-foreground mb-8">
          Feel free to reach out to us using any of the contact methods
          below. We'll get back to you as quickly as possible.
        </p>
      </div>

      <div className="space-y-6">
        <ContactInfoItem icon={MapPin} title="Our Office">
          <p className="text-muted-foreground">
            3rd Floor, Office No. C 305 DP Road, Police, Wireless
            Colony, Pune, Maharashtra.
          </p>
        </ContactInfoItem>

        <ContactInfoItem icon={Mail} title="Email Us">
          <a
            href="mailto:info@atorix.in"
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            info@atorix.in
          </a>
          <p className="text-muted-foreground text-sm mt-1">
            For general inquiries
          </p>
        </ContactInfoItem>

        <ContactInfoItem icon={Phone} title="Call Us">
          <a
            href="tel:+918956001555"
            className="text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            +91 89560 01555
          </a>
          <p className="text-muted-foreground text-sm mt-1">
            Mon-Sat from 9:30am to 6:30pm
          </p>
        </ContactInfoItem>

        <ContactInfoItem icon={Clock} title="Working Hours">
          <p className="text-muted-foreground">
            Monday - Saturday: 9:30 AM - 6:30 PM
            <br />
            Sunday: Closed
          </p>
        </ContactInfoItem>
      </div>
    </motion.div>
  );
}
