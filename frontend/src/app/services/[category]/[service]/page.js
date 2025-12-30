"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Import components
import Testimonial from "@/components/services/categoryService/Testimonial";
import FeatureShowcase from "@/components/services/categoryService/FeatureShowcase";
import ProcessSteps from "@/components/services/categoryService/ProcessSteps";
import IndustrySection from "@/components/services/categoryService/IndustrySection";
import FaqSection from "@/components/services/categoryService/FaqSection";

// Import service data
import servicesData from "@/data/services.json";
import serviceDetailsData from "@/data/serviceDetails.json";

// Enhanced animated gradient background component with interactive elements
function EnhancedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse position relative to window size for parallax effect
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10"></div>

      {/* Dynamic animated gradient shapes that react to mouse movement */}
      <div
        className="absolute -top-[30%] -right-[10%] w-[80%] h-[70%] rounded-full bg-gradient-to-br from-primary/15 via-blue-500/10 to-transparent opacity-70 blur-[80px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * -20}px)`,
        }}
      ></div>

      <div
        className="absolute top-[60%] -left-[10%] w-[50%] h-[40%] rounded-full bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-transparent opacity-60 blur-[70px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * 20}px)`,
        }}
      ></div>

      {/* Subtle animated accent shapes */}
      <div className="absolute top-[20%] right-[30%] w-[20%] h-[20%] rounded-full bg-cyan-500/10 opacity-40 blur-[50px] animate-pulse"></div>
      <div
        className="absolute bottom-[10%] right-[20%] w-[15%] h-[15%] rounded-full bg-amber-500/10 opacity-30 blur-[40px] animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>

      {/* Pattern overlay with subtle animation */}
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.03] animate-subtle-float"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => {
          const top = Math.floor(Math.random() * 100);
          const left = Math.floor(Math.random() * 100);
          const size = Math.floor(Math.random() * 5) + 1;
          const opacity = Math.random() * 0.15;
          const duration = 15 + Math.random() * 30;
          const delay = Math.random() * -30;

          return (
            <div
              key={i}
              className="absolute rounded-full bg-primary"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: opacity,
                animation: `float ${duration}s infinite ease-in-out ${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Animated light beams */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-primary/40 via-primary/10 to-transparent animate-pulse"></div>
      <div
        className="absolute top-0 left-2/3 w-[1px] h-full bg-gradient-to-b from-primary/30 via-primary/10 to-transparent animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-violet-500/30 via-violet-500/10 to-transparent animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Horizontal light traces */}
      <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-subtle-float"></div>
      <div
        className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent animate-subtle-float"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
}

// Interactive CTA background with animated elements
function InteractiveCTABackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient layer with vibrant colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-indigo-700 to-violet-800"></div>

      {/* Animated radial patterns */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full bg-gradient-to-r from-blue-500/0 via-blue-400/20 to-blue-500/0 animate-slow-spin"></div>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rounded-full bg-gradient-to-r from-indigo-600/0 via-indigo-500/15 to-indigo-600/0 animate-slow-spin"
          style={{ animationDirection: "reverse", animationDuration: "25s" }}
        ></div>
      </div>

      {/* Vibrant light streams */}
      <div className="absolute top-0 left-1/5 w-[2px] h-full bg-gradient-to-b from-white/30 via-white/10 to-transparent skew-x-12 animate-pulse"></div>
      <div
        className="absolute top-0 left-2/5 w-[3px] h-full bg-gradient-to-b from-white/25 via-white/5 to-transparent -skew-x-12 animate-pulse"
        style={{ animationDelay: "0.7s" }}
      ></div>
      <div
        className="absolute top-0 left-3/5 w-[2px] h-full bg-gradient-to-b from-white/30 via-white/10 to-transparent skew-x-12 animate-pulse"
        style={{ animationDelay: "1.4s" }}
      ></div>
      <div
        className="absolute top-0 left-4/5 w-[1px] h-full bg-gradient-to-b from-white/25 via-white/5 to-transparent -skew-x-12 animate-pulse"
        style={{ animationDelay: "2.1s" }}
      ></div>

      {/* Floating light orbs */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => {
          const top = Math.floor(Math.random() * 100);
          const left = Math.floor(Math.random() * 100);
          const size = Math.floor(Math.random() * 6) + 2;
          const opacity = Math.random() * 0.3 + 0.1;
          const duration = 20 + Math.random() * 40;
          const delay = Math.random() * -40;

          return (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: opacity,
                animation: `float ${duration}s infinite ease-in-out ${delay}s, glow 3s infinite alternate ease-in-out ${Math.random() * 3}s`,
              }}
            />
          );
        })}
      </div>

      {/* Grid overlay with animated opacity */}
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10 animate-opacity-pulse"></div>

      {/* Gradient wave effect */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%]">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 to-transparent animate-wave"></div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent animate-wave"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
    </div>
  );
}

export default function ServiceDetailPage() {
  const params = useParams();
  const { category: categoryId, service: serviceId } = params;
  const [loading, setLoading] = useState(true);
  const [serviceData, setServiceData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [serviceDetails, setServiceDetails] = useState(null);

  // Reference for scroll animations
  const ctaRef = useRef(null);
  const isCtaInView = useInView(ctaRef, { once: false, amount: 0.3 });
  const ctaAnimation = useAnimation();

  useEffect(() => {
    if (isCtaInView) {
      ctaAnimation.start({
        y: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" },
      });
    }
  }, [isCtaInView, ctaAnimation]);

  useEffect(() => {
    // Find category and service from the data
    const category = servicesData.categories.find(
      (cat) => cat.id === categoryId
    );

    if (!category) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const service = category.services.find((serv) => serv.id === serviceId);

    if (!service) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Get related services (other services in the same category)
    const related = category.services
      .filter((serv) => serv.id !== serviceId)
      .slice(0, 3);

    setCategoryData(category);
    setServiceData(service);
    setRelatedServices(related);

    // Get additional service details if available
    try {
      const details =
        serviceDetailsData.serviceDetails[categoryId]?.[serviceId];
      setServiceDetails(details || {});
    } catch (error) {
      console.error("Error loading service details:", error);
      setServiceDetails({});
    }

    setLoading(false);
  }, [categoryId, serviceId]);

  // Add global animations to the stylesheet
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-15px) translateX(5px); }
      }
      @keyframes subtle-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      @keyframes glow {
        0% { box-shadow: 0 0 5px 0 rgba(255, 255, 255, 0.3); }
        100% { box-shadow: 0 0 20px 0 rgba(255, 255, 255, 0.7); }
      }
      @keyframes slow-spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      @keyframes opacity-pulse {
        0%, 100% { opacity: 0.08; }
        50% { opacity: 0.15; }
      }
      @keyframes wave {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-20px) translateX(-10px); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-primary/20 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-64 bg-muted-foreground/20 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/10">
        <div className="text-center max-w-xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the service you're looking for. It may have been
            moved or doesn't exist.
          </p>
          <Button asChild>
            <Link href="/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const {
    testimonials = [],
    faqs = [],
    processSteps = [],
    relevantIndustries = null,
    benefits = [],
    additionalContent = null,
  } = serviceDetails || {};

  // Special handler for different service pages
  const isS4HANAPage =
    categoryId === "erp-tech" && serviceId === "sap-s4-hana-ecc";
  const isS4HANACloudPage =
    categoryId === "erp-tech" && serviceId === "sap-s4-hana-cloud";
  const isBusinessOnePage =
    categoryId === "erp-tech" && serviceId === "sap-business-one-hana";
  const isAnalyticsPage =
    categoryId === "erp-tech" && serviceId === "sap-analytics";
  const isDynamicsPage =
    categoryId === "microsoft-dynamics" && serviceId === "dynamics-365";
  const isCyberSecurityPage =
    categoryId === "security" && serviceId === "cyber-security";

  return (
    <>
      {/* Hero Section with Enhanced Interactive Background */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <EnhancedBackground />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <Link
                href="/services"
                className="text-sm font-medium text-muted-foreground hover:text-primary inline-flex items-center group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="relative">
                  Back to Services
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-5"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              {categoryData.name}
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {serviceData.name}
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {serviceData.description}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Button
                asChild
                size="lg"
                className="relative overflow-hidden group"
              >
                <Link href="/contact">
                  <span className="relative z-10">Get Started</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-foreground/0 via-primary-foreground/10 to-primary-foreground/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="relative overflow-hidden group"
              >
                <Link href="/get-demo">
                  <span className="relative z-10">Request Demo</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-muted/0 via-muted/30 to-muted/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section with subtle background */}
      <section className="py-16 md:py-24 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {/* Overview */}
                <h2 className="text-3xl font-bold mb-6 relative inline-block">
                  Overview
                  <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                  {additionalContent && additionalContent.overview ? (
                    <p>{additionalContent.overview}</p>
                  ) : (
                    <p>{serviceData.details}</p>
                  )}
                </div>

                {/* Special sections for SAP S/4 HANA page */}
                {isS4HANAPage && additionalContent && (
                  <>
                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      Why Consider S/4HANA Now?
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.whyConsider}</p>
                    </div>

                    <h3 className="text-2xl font-bold mb-4">
                      For a solution architect, the changes in the intelligent
                      enterprise that enable these are:
                    </h3>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.intelligentEnterprise}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      How is S/4HANA different to ERP?
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.howDifferent}</p>
                    </div>
                  </>
                )}

                {/* Special sections for SAP S/4 HANA Cloud page */}
                {isS4HANACloudPage && additionalContent && (
                  <>
                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      SAP S/4HANA Cloud Capabilities
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.capabilities}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      Licensing Model
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.licensingModel}</p>
                    </div>
                  </>
                )}

                {/* Special sections for SAP Business One HANA page */}
                {isBusinessOnePage && additionalContent && (
                  <>
                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      Customer Choice
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.customerChoice}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      HANA-Only Features
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.hanaOnlyFeatures}</p>
                    </div>
                  </>
                )}

                {/* Special sections for SAP Analytics page */}
                {isAnalyticsPage && additionalContent && (
                  <>
                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      Business Challenges
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.challenge}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      The Solution
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.solution}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      What is SAP Analytics Hub?
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.definition}</p>
                    </div>
                  </>
                )}

                {/* Special sections for Microsoft Dynamics 365 page */}
                {isDynamicsPage && additionalContent && (
                  <>
                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      Make Informed Decisions
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.makeInformedDecisions}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      Improve Forecast Accuracy
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.improveForecastAccuracy}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      Accelerate Financial Close And Reporting
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.accelerateFinancialClose}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      Automate and Secure Your Supply Chain
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.automateSupplyChain}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      Improve Sales and Customer Service
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.improveSales}</p>
                    </div>
                  </>
                )}

                {/* Special sections for Cyber Security page */}
                {isCyberSecurityPage && additionalContent && (
                  <>
                    <h2 className="text-3xl font-bold mb-6">
                      Zero-Configuration Web Application and API Protection
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.zeroConfigurationProtection}</p>
                      <p className="mt-4">Key benefits:</p>
                      <p>{additionalContent.keyBenefits}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6">
                      New Security Challenges
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.securityChallenges}</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-6">Our Approach</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.atorixApproach}</p>
                    </div>
                  </>
                )}

                {/* Key Features */}
                <h2 className="text-3xl font-bold mb-6">Key Features</h2>
                <FeatureShowcase
                  features={serviceData.features}
                  className="mb-16"
                />

                {/* Key Benefits Section (if available) */}
                {benefits && benefits.length > 0 && (
                  <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-6">Key Benefits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-start space-x-3"
                        >
                          <div className="flex-shrink-0 rounded-full w-7 h-7 bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-lg">{benefit}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Process Steps (if available) */}
                {processSteps && processSteps.length > 0 && (
                  <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">
                      Our Implementation Process
                    </h2>
                    <ProcessSteps steps={processSteps} />
                  </div>
                )}

                {/* Industry Section (if available) */}
                {relevantIndustries && relevantIndustries.length > 0 && (
                  <div className="mb-16">
                    <IndustrySection relevantIndustries={relevantIndustries} />
                  </div>
                )}

                {/* FAQ Section (if available) */}
                {faqs && faqs.length > 0 && (
                  <div className="mb-16">
                    <FaqSection faqs={faqs} />
                  </div>
                )}

                {/* CTA Box */}
                <div className="bg-muted/20 p-8 rounded-xl border border-border">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to get started?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Contact our team to learn more about our {serviceData.name}{" "}
                    and how we can help your business succeed.
                  </p>
                  <Button asChild size="lg">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Service Category Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-muted/20 rounded-xl border border-border p-6"
                >
                  <h3 className="text-xl font-bold mb-4">Service Category</h3>
                  <p className="text-muted-foreground mb-4">
                    {categoryData.name}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/services#${categoryData.id}-details`}>
                      Explore Category
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>

                {/* Testimonials Section (if available) */}
                {testimonials && testimonials.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="space-y-4"
                  >
                    <h3 className="text-xl font-bold">Client Testimonials</h3>
                    {testimonials.map((testimonial, index) => (
                      <Testimonial key={index} testimonial={testimonial} />
                    ))}
                  </motion.div>
                )}

                {/* Related Services Section */}
                {relatedServices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-muted/20 rounded-xl border border-border p-6"
                  >
                    <h3 className="text-xl font-bold mb-4">Related Services</h3>
                    <div className="space-y-4">
                      {relatedServices.map((service, index) => (
                        <Link
                          key={service.id}
                          href={`/services/${categoryData.id}/${service.id}`}
                          className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{service.name}</p>
                            <ArrowUpRight className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {service.description.substring(0, 80)}...
                          </p>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with enhanced interactive background */}
      <section className="py-16 md:py-24 text-white relative overflow-hidden">
        {/* Enhanced animated interactive background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 overflow-hidden">
          {/* Animated circular glow elements */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] rounded-full bg-gradient-to-r from-blue-500/0 via-blue-400/20 to-blue-500/0 animate-slow-spin"></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full bg-gradient-to-r from-indigo-600/0 via-indigo-500/15 to-indigo-600/0 animate-slow-spin"
            style={{ animationDirection: "reverse", animationDuration: "30s" }}
          ></div>

          {/* Dynamic wave effect */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%]">
            <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 to-transparent animate-wave"></div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent animate-wave"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>

          {/* Animated overlay patterns */}
          <div className="absolute inset-0 opacity-10 bg-[url('/grid.png')] animate-opacity-pulse"></div>

          {/* Light beams with animation */}
          <div className="absolute left-1/4 top-0 w-[2px] h-full bg-gradient-to-b from-white/30 via-white/10 to-transparent skew-x-12 animate-pulse"></div>
          <div
            className="absolute left-2/3 top-0 w-[3px] h-full bg-gradient-to-b from-white/25 via-white/5 to-transparent -skew-x-12 animate-pulse"
            style={{ animationDelay: "0.7s" }}
          ></div>
          <div
            className="absolute left-1/3 top-0 w-[1px] h-full bg-gradient-to-b from-white/20 via-white/5 to-transparent skew-x-6 animate-pulse"
            style={{ animationDelay: "1.4s" }}
          ></div>

          {/* Floating particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => {
              const top = Math.floor(Math.random() * 100);
              const left = Math.floor(Math.random() * 100);
              const size = Math.floor(Math.random() * 4) + 2;
              const opacity = Math.random() * 0.6 + 0.2;
              const duration = 20 + Math.random() * 30;
              const delay = Math.random() * -30;

              return (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity: opacity,
                    animation: `float ${duration}s infinite ease-in-out ${delay}s, glow 3s infinite alternate ease-in-out ${Math.random() * 3}s`,
                  }}
                />
              );
            })}
          </div>

          {/* Horizontal light traces */}
          <div className="absolute top-1/4 left-0 w-full h-[1px] mt-8 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-subtle-float"></div>
          <div
            className="absolute top-3/4 left-0 w-full h-[1px] mt-4 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-subtle-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Transform Your Business with Expert SAP Services
            </motion.h2>
            <motion.p
              className="text-xl text-white/80 mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Let our team of experienced consultants help you harness the full
              potential of SAP for your business.
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255,255,255,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-white/90 relative overflow-hidden group"
                >
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2"
                  >
                    <span className="relative z-10">Contact Us</span>
                    <ArrowRight className="h-4 w-4 relative z-10" />
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-white bg-blue-700/40 border-white/20 hover:bg-blue-600/50 hover:border-white/40 transition-all duration-300"
                >
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2"
                  >
                    <span>Explore More Services</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
