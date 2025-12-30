"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlusIcon, MinusIcon } from "lucide-react";

// Default FAQs about SAP services that can be used across services
const defaultFaqs = [
  {
    question: "What are the typical timeframes for an SAP implementation?",
    answer: "Implementation timeframes vary based on project scope, complexity, and your organization's readiness. A small-scale implementation might take 3-6 months, while enterprise-wide deployments typically range from 9-18 months. Our experienced consultants work with you to create realistic timelines based on your specific needs and business priorities."
  },
  {
    question: "How do you handle data migration during SAP implementations?",
    answer: "Our data migration approach follows a proven methodology: 1) Data assessment and cleansing, 2) Mapping source to target structures, 3) Developing extraction and loading procedures, 4) Testing with sample data sets, 5) Validation and reconciliation, and 6) Final migration with verification. We use specialized tools to ensure data integrity and minimize downtime during the transition."
  },
  {
    question: "What support options do you provide after go-live?",
    answer: "We offer flexible post-implementation support including: 24/7 technical support for critical issues, regular health checks and optimization, user training and knowledge transfer, ongoing system maintenance, and continuous improvement services. Our support packages can be tailored to your specific needs and budget requirements."
  },
  {
    question: "How do you ensure business continuity during implementation?",
    answer: "Business continuity is a top priority in our implementation methodology. We use a phased approach, maintain parallel systems during transition, conduct thorough testing, provide comprehensive user training, develop detailed cutover strategies, and offer hyper-care support immediately after go-live to quickly address any issues that may arise."
  },
  {
    question: "Can you integrate SAP with our existing systems?",
    answer: "Yes, we specialize in integrating SAP with a wide range of existing systems, including legacy applications, third-party solutions, and custom-developed software. Our integration experts use standard SAP interfaces, APIs, middleware solutions, and custom connectors as needed to create seamless data flows across your technology landscape."
  }
];

const FaqItem = ({ faq, index, isOpen, toggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="border border-border/50 rounded-lg overflow-hidden mb-4"
    >
      <button
        className="flex justify-between items-center w-full p-4 text-left bg-background/50 hover:bg-muted/20 transition-colors"
        onClick={() => toggle(index)}
      >
        <h3 className="font-medium text-lg">{faq.question}</h3>
        <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full border border-primary/30">
          {isOpen ? (
            <MinusIcon className="h-3.5 w-3.5 text-primary" />
          ) : (
            <PlusIcon className="h-3.5 w-3.5 text-primary" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-border/30">
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FaqSection({ faqs = [], title = "Frequently Asked Questions" }) {
  const [openIndex, setOpenIndex] = useState(0);

  // Combine service-specific FAQs with default ones
  const allFaqs = [...faqs, ...defaultFaqs.slice(0, 5 - faqs.length)];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="w-full">
      <motion.h2
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>

      <div>
        {allFaqs.map((faq, index) => (
          <FaqItem
            key={index}
            faq={faq}
            index={index}
            isOpen={openIndex === index}
            toggle={toggleFaq}
          />
        ))}
      </div>
    </div>
  );
}
