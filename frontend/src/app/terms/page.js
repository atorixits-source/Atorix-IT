"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
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

export default function TermsOfService() {
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
              <FileText className="h-4 w-4 mr-2" />
              Legal
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              Terms of Service
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
                  These Terms of Service ("Terms") govern your access to and use of the Atorix IT Solutions website, services, and products ("Services"). Please read these Terms carefully, and contact us if you have any questions. By accessing or using our Services, you agree to be bound by these Terms.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing or using our Services, you confirm that you accept these Terms and agree to comply with them. If you do not agree to these Terms, you must not access or use our Services. We recommend that you print a copy of these Terms for future reference.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">2. Changes to Terms</h2>
                <p>
                  We may revise these Terms at any time by amending this page. Please check this page from time to time to take notice of any changes we made, as they are binding on you. Your continued use of the Services following the posting of revised Terms means you accept and agree to the changes.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">3. Accessing Our Services</h2>
                <p className="mb-4">
                  We do not guarantee that our Services, or any content on it, will always be available or be uninterrupted. We may suspend, withdraw, discontinue or change all or any part of our Services without notice. We will not be liable to you if for any reason our Services are unavailable at any time or for any period.
                </p>
                <p>
                  You are responsible for making all arrangements necessary for you to have access to our Services. You are also responsible for ensuring that all persons who access our Services through your internet connection are aware of these Terms and other applicable terms and conditions, and that they comply with them.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">4. Your Account</h2>
                <p className="mb-4">
                  If you create an account with us, you must treat your username and password as confidential, and you must not disclose it to any other person. You agree to notify us immediately of any unauthorized access to your account or password, or any other breach of security.
                </p>
                <p>
                  We have the right to disable any user account at any time, if in our reasonable opinion you have failed to comply with any of the provisions of these Terms.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
                <p className="mb-4">
                  We are the owner or the licensee of all intellectual property rights in our Services, and in the material published on it. Those works are protected by copyright laws and treaties around the world. All such rights are reserved.
                </p>
                <p className="mb-4">
                  You may not use, reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services, except as follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.</li>
                  <li>You may store files that are automatically cached by your Web browser for display enhancement purposes.</li>
                  <li>You may print or download one copy of a reasonable number of pages of the Services for your own personal, non-commercial use and not for further reproduction, publication, or distribution.</li>
                </ul>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">6. No Unlawful or Prohibited Use</h2>
                <p className="mb-4">
                  You may use our Services only for lawful purposes and in accordance with these Terms. You agree not to use our Services:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                  <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
                  <li>To impersonate or attempt to impersonate Atorix IT Solutions, an Atorix IT Solutions employee, another user, or any other person or entity.</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which may harm Atorix IT Solutions or users of the Services.</li>
                </ul>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">7. Service Description and Limitation of Liability</h2>
                <p className="mb-4">
                  Atorix IT Solutions provides SAP implementation and related IT consulting services as described on our website. While we strive to provide high-quality services, we make no guarantees or warranties about the results of our services.
                </p>
                <p className="mb-4">
                  To the fullest extent permitted by law, Atorix IT Solutions excludes all liability for any direct, indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your access to or use of or inability to access or use the Services.</li>
                  <li>Any conduct or content of any third party on the Services.</li>
                  <li>Any content obtained from the Services.</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
                </ul>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">8. Indemnification</h2>
                <p>
                  You agree to defend, indemnify, and hold harmless Atorix IT Solutions, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Services.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">9. Governing Law and Jurisdiction</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. You agree to submit to the personal and exclusive jurisdiction of the courts located in Pune, Maharashtra, India, for the resolution of any disputes.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">10. Entire Agreement</h2>
                <p>
                  These Terms, our Privacy Policy, and any other agreements or terms referenced herein constitute the sole and entire agreement between you and Atorix IT Solutions regarding the Services and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the Services.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
                <p>
                  Questions about the Terms should be sent to us at:
                </p>
                <ul className="list-none space-y-2 mt-4">
                  <li>
                    <strong>Email:</strong> info@atorix.in
                  </li>
                  <li>
                    <strong>Phone:</strong> +91 89560 01555
                  </li>
                  <li>
                    <strong>Address:</strong> 3rd Floor, Office No. C 305 DP Road, Police, Wireless Colony, Pune, Maharashtra.
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
