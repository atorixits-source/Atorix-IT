"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  X,
  Mail,
  HelpCircle,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingContactButtons() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const phoneNumber = "+918956001555"; // Phone number for both call and WhatsApp

  // Show the floating buttons after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
        // Also collapse the menu when scrolling back to top
        setExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
    setTooltipVisible(null); // Hide tooltips when toggling
  };

  // Close the expanded menu
  const closeMenu = () => {
    setExpanded(false);
    setTooltipVisible(null);
  };

  // Handle tooltip display
  const showTooltip = (id) => setTooltipVisible(id);
  const hideTooltip = () => setTooltipVisible(null);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  // Contact options configuration
  const contactOptions = [
    {
      id: "whatsapp",
      icon: <MessageCircle size={22} />,
      ariaLabel: "Contact via WhatsApp",
      tooltip: "Message on WhatsApp",
      href: `https://wa.me/${phoneNumber.replace(/\+/g, "")}`,
      bgColor: "bg-green-500",
      hoverBgColor: "hover:bg-green-600",
      external: true,
    },
    {
      id: "call",
      icon: <Phone size={22} />,
      ariaLabel: "Call us",
      tooltip: "Call us now",
      href: `tel:${phoneNumber}`,
      bgColor: "bg-blue-500",
      hoverBgColor: "hover:bg-blue-600",
      external: false,
    },
    {
      id: "email",
      icon: <Mail size={22} />,
      ariaLabel: "Email us",
      tooltip: "Send us an email",
      href: "mailto:info@atorix.in",
      bgColor: "bg-violet-500",
      hoverBgColor: "hover:bg-violet-600",
      external: true,
    },
    {
      id: "help",
      icon: <HelpCircle size={22} />,
      ariaLabel: "Get help",
      tooltip: "How can we help?",
      href: "/contact",
      bgColor: "bg-amber-500",
      hoverBgColor: "hover:bg-amber-600",
      external: false,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop",
    },
  };

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end">
      {/* Scroll to top button - shows only when expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            onClick={scrollToTop}
            className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200 p-3 rounded-full mb-3 shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Contact options */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col space-y-3 mb-3"
          >
            {contactOptions.map((option) => (
              <motion.div
                key={option.id}
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => showTooltip(option.id)}
                onMouseLeave={hideTooltip}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={option.href}
                  target={option.external ? "_blank" : "_self"}
                  rel={option.external ? "noopener noreferrer" : ""}
                  className={`${option.bgColor} ${option.hoverBgColor} text-white p-3 rounded-full flex items-center justify-center shadow-lg transition-all duration-300`}
                  aria-label={option.ariaLabel}
                >
                  {option.icon}
                </Link>

                {/* Tooltip */}
                <AnimatePresence>
                  {tooltipVisible === option.id && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-black/80 dark:bg-white/90 text-white dark:text-black text-sm py-1 px-2 rounded whitespace-nowrap"
                    >
                      {option.tooltip}
                      <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-black/80 dark:bg-white/90"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button with pulse animation */}
      <motion.button
        onClick={toggleExpanded}
        className={`p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          expanded
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-primary text-white hover:bg-primary/90"
        }`}
        aria-label="Toggle contact options"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={!expanded ? pulseAnimation : {}}
      >
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {expanded ? <X size={24} /> : <Phone size={24} />}
        </motion.div>
      </motion.button>
    </div>
  );
}
