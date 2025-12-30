"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, AlertCircle, CheckCircle } from "lucide-react";
import { submitFormData, submitWeb3FormData, submitDemoRequest } from "@/lib/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (optional field)
    if (formData.phone && !/^[+\d\s\-()]{7,20}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    // Clear API error when user makes any changes
    if (apiError) {
      setApiError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = document.querySelector("[aria-invalid='true']");
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    setSubmitting(true);
    setApiError(null);

    try {
      // Prepare the data for submission
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || 'Not provided',
        role: 'Website Visitor', // Adding a default role since it's required
        interests: ['Website Inquiry'], // Adding default interests since it's required
        message: formData.message.trim() || 'No message provided',
        source: 'website-contact',
        status: 'new',
        metadata: {
          formType: 'contact-form',
          submittedAt: new Date().toISOString()
        }
      };

      // 1. Submit to Web3Forms for email notification
      const web3Result = await submitWeb3FormData({
        ...submissionData,
        subject: `New Contact from ${submissionData.name}`,
        from_name: submissionData.name,
        reply_to: submissionData.email
      });

      // 2. Submit to our backend API for database storage
      try {
        const demoResult = await submitDemoRequest(submissionData);
        if (!demoResult.success) {
          console.warn('Demo request submission warning:', demoResult.message);
        }
      } catch (backendError) {
        console.error('Demo request submission failed:', backendError);
        // We don't fail the whole submission if only backend fails but web3forms succeeded
      }

      if (web3Result.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
        });

        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        setApiError(web3Result.error || "Failed to submit form. Please try again or contact us directly.");
        console.error('Form submission failed:', web3Result);
      }
    } catch (error) {
      setApiError("An unexpected error occurred. Please try again later.");
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="lg:col-span-2"
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.15 }}
    >
      <motion.div
        className="bg-card rounded-xl shadow-lg border border-border/40 p-8 backdrop-blur-sm dark:bg-black/30"
        whileHover={{
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

        {submitted ? (
          <motion.div
            className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-6 rounded-lg mb-6 flex items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full bg-green-100 dark:bg-green-800 p-1 mr-3 flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="font-medium">Thank you for your message!</p>
              <p className="text-sm mt-1">
                We have received your inquiry and will get back to you shortly.
              </p>
            </div>
          </motion.div>
        ) : null}

        {apiError && (
          <motion.div
            className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-6 rounded-lg mb-6 flex items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-full bg-red-100 dark:bg-red-800 p-1 mr-3 flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <p className="font-medium">Error Submitting Form</p>
              <p className="text-sm mt-1">{apiError}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden honeypot field to prevent spam */}
          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            style={{ display: "none" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <label htmlFor="name" className="text-sm font-medium">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={errors.name ? "true" : "false"}
                className={
                  "w-full px-4 py-2 rounded-md border " +
                  (errors.name
                    ? "border-red-500 dark:border-red-400"
                    : "border-input") +
                  " bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                }
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.name}
                </p>
              )}
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <label htmlFor="email" className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={errors.email ? "true" : "false"}
                className={
                  "w-full px-4 py-2 rounded-md border " +
                  (errors.email
                    ? "border-red-500 dark:border-red-400"
                    : "border-input") +
                  " bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                }
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.email}
                </p>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                aria-invalid={errors.phone ? "true" : "false"}
                className={
                  "w-full px-4 py-2 rounded-md border " +
                  (errors.phone
                    ? "border-red-500 dark:border-red-400"
                    : "border-input") +
                  " bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                }
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  {errors.phone}
                </p>
              )}
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <label htmlFor="company" className="text-sm font-medium">
                Company Name
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Enter your company name"
              />
            </motion.div>
          </div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            <label htmlFor="message" className="text-sm font-medium">
              Your Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              aria-invalid={errors.message ? "true" : "false"}
              className={
                "w-full px-4 py-2 rounded-md border " +
                (errors.message
                  ? "border-red-500 dark:border-red-400"
                  : "border-input") +
                " bg-background focus:border-primary focus:ring-1 focus:ring-primary resize-none"
              }
              placeholder="Tell us about your project or inquiry"
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm flex items-center mt-1">
                <AlertCircle className="h-3.5 w-3.5 mr-1" />
                {errors.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.22 }}
          >
            <Button
              type="submit"
              className="w-full sm:w-auto gap-2"
              size="lg"
              disabled={submitting}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
}
