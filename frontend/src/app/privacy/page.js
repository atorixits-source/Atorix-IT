"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Animated blob background
function AnimatedBlobBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main blob */}
      <motion.div
        className="absolute rounded-full bg-primary/10 blur-[120px]"
        style={{
          width: "50%",
          height: "50%",
          top: "10%",
          left: "10%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary blob */}
      <motion.div
        className="absolute rounded-full bg-blue-500/10 blur-[100px]"
        style={{
          width: "35%",
          height: "35%",
          bottom: "20%",
          right: "5%",
        }}
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <>
      {/* Header Section */}
      <section className="py-16 md:py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <AnimatedBlobBackground />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <Shield className="h-4 w-4 mr-2" />
              Privacy Policy
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last Updated: May 5, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <div className="mb-10">
                <p className="text-lg leading-relaxed">
                  At Atorix IT Solutions, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p className="mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Register on our website</li>
                  <li>Request a demo or consultation</li>
                  <li>Sign up for our newsletter</li>
                  <li>Participate in surveys or promotions</li>
                  <li>Contact us through our contact form</li>
                </ul>
                <p>The personal information we may collect includes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, phone number</li>
                  <li>Company name and job title</li>
                  <li>Billing address and payment information</li>
                  <li>Any other information you choose to provide</li>
                </ul>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Automatically Collected Information</h2>
                <p className="mb-4">When you visit our website, we may automatically collect certain information about your device, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Pages you visit</li>
                  <li>Time and date of your visit</li>
                  <li>Time spent on each page</li>
                  <li>Other diagnostic data</li>
                </ul>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Use of Your Information</h2>
                <p className="mb-4">We may use the information we collect for various purposes, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Providing, maintaining, and improving our services</li>
                  <li>Processing transactions and sending related information</li>
                  <li>Sending administrative information</li>
                  <li>Sending marketing and promotional communications</li>
                  <li>Responding to inquiries and providing customer support</li>
                  <li>Conducting research and analysis to improve our services</li>
                  <li>Protecting our legal rights and preventing fraud</li>
                </ul>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Disclosure of Your Information</h2>
                <p className="mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Service providers and third-party vendors who perform services on our behalf</li>
                  <li>Business partners with whom we jointly offer products or services</li>
                  <li>Affiliated companies within our corporate family</li>
                  <li>Legal and regulatory authorities, as required by law</li>
                </ul>
                <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes without your explicit consent.</p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Security of Your Information</h2>
                <p>
                  We use appropriate administrative, technical, and physical security measures designed to protect your personal information. However, no data transmission over the Internet or information storage technology can be guaranteed to be 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
                <p className="mb-4">
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
                <p>
                  We use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your computer until you delete them).
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
                <p className="mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right to access and receive a copy of your personal information</li>
                  <li>Right to rectify or update your personal information</li>
                  <li>Right to erase your personal information</li>
                  <li>Right to restrict processing of your personal information</li>
                  <li>Right to object to processing of your personal information</li>
                  <li>Right to data portability</li>
                  <li>Right to withdraw consent</li>
                </ul>
                <p className="mt-4">
                  To exercise any of these rights, please contact us using the contact information provided below.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
                <p>
                  Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we learn we have collected or received personal information from a child under 16 without verification of parental consent, we will delete that information.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-none space-y-2 mt-4">
                  <li>
                    <strong>By email:</strong> info@atorix.in
                  </li>
                  <li>
                    <strong>By phone:</strong> +91 89560 01555
                  </li>
                  <li>
                    <strong>By mail:</strong> 3rd Floor, Office No. C 305 DP Road, Police, Wireless Colony, Pune, Maharashtra.
                  </li>
                </ul>
              </div>
            </motion.div>

            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
