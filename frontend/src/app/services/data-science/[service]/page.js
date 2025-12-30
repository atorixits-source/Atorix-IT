"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  BarChart2,
  Cpu,
  LineChart,
  PieChart,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Import service data
import servicesData from "@/data/services.json";
import serviceDetailsData from "@/data/serviceDetails.json";

// Import component for the specific sections
import Testimonial from "@/components/services/categoryService/Testimonial";
import FeatureShowcase from "@/components/services/categoryService/FeatureShowcase";
import ProcessSteps from "@/components/services/categoryService/ProcessSteps";
import IndustrySection from "@/components/services/categoryService/IndustrySection";
import FaqSection from "@/components/services/categoryService/FaqSection";

// Custom Background component for Data Science services
function DataScienceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10"></div>

      {/* Dynamic gradient elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.02]"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => {
          const top = Math.floor(Math.random() * 100);
          const left = Math.floor(Math.random() * 100);
          const size = Math.floor(Math.random() * 4) + 1;
          const opacity = Math.random() * 0.1;
          const duration = 20 + Math.random() * 30;
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

      {/* Light beams */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-primary/20 via-primary/5 to-transparent"></div>
      <div className="absolute top-0 left-2/3 w-[1px] h-full bg-gradient-to-b from-indigo-500/20 via-indigo-500/5 to-transparent"></div>

      {/* Horizontal trace lines */}
      <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
      <div className="absolute top-2/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent"></div>
    </div>
  );
}

export default function DataScienceServicePage() {
  const params = useParams();
  const { service: serviceId } = params;
  const [loading, setLoading] = useState(true);
  const [serviceData, setServiceData] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [serviceDetails, setServiceDetails] = useState(null);

  // Get service icon based on service ID
  const getServiceIcon = (id) => {
    const icons = {
      "data-analytics": BarChart2,
      "machine-learning": Cpu,
      "data-engineering": Database,
      "data-visualization": PieChart,
      "real-time-analytics": LineChart,
    };

    return icons[id] || Zap;
  };

  const ServiceIcon = getServiceIcon(serviceId);

  useEffect(() => {
    // Find data science category and service
    const category = servicesData.categories.find(
      (cat) => cat.id === "data-science"
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

    // Get related services (other services in data science)
    const related = category.services
      .filter((serv) => serv.id !== serviceId)
      .slice(0, 3);

    setServiceData(service);
    setRelatedServices(related);

    // Get additional service details if available
    try {
      const details =
        serviceDetailsData.serviceDetails["data-science"]?.[serviceId];
      setServiceDetails(details || {});
    } catch (error) {
      console.error("Error loading service details:", error);
      setServiceDetails({});
    }

    setLoading(false);
  }, [serviceId]);

  // Add global animations to the stylesheet
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-10px) translateX(5px); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
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
            <Link href="/services/data-science">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Data Science Services
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
    relevantIndustries = [],
    benefits = [],
    additionalContent = {},
  } = serviceDetails || {};

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <DataScienceBackground />

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <Link
                href="/services/data-science"
                className="text-sm font-medium text-muted-foreground hover:text-primary inline-flex items-center group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="relative">
                  Back to Data Science Services
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
              Data Science
            </motion.div>

            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <ServiceIcon className="h-8 w-8 text-primary" />
              </div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {serviceData.name}
              </motion.h1>
            </div>

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

      {/* Main Content Section */}
      <section className="py-16 md:py-24 relative">
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

                {/* Additional Content - Analytics Types for data-analytics */}
                {serviceId === "data-analytics" && additionalContent && additionalContent.analyticsTypes && (
                  <>
                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      Analytics Capabilities
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.analyticsTypes}</p>
                    </div>
                  </>
                )}

                {/* Additional Content - Machine Learning for machine-learning */}
                {serviceId === "machine-learning" && additionalContent && additionalContent.mlTypes && (
                  <>
                    <h2 className="text-3xl font-bold mb-6 relative inline-block">
                      Machine Learning Expertise
                      <span className="absolute -bottom-1 left-0 w-1/3 h-1 bg-gradient-to-r from-primary to-primary/0"></span>
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                      <p>{additionalContent.mlTypes}</p>
                    </div>
                  </>
                )}

                {/* Key Features */}
                <h2 className="text-3xl font-bold mb-6">Key Features</h2>
                <FeatureShowcase
                  features={serviceData.features}
                  className="mb-16"
                />

                {/* Key Benefits Section */}
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

                {/* Process Steps */}
                {processSteps && processSteps.length > 0 && (
                  <div className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">
                      Our Implementation Process
                    </h2>
                    <ProcessSteps steps={processSteps} />
                  </div>
                )}

                {/* Industry Section */}
                {relevantIndustries && relevantIndustries.length > 0 && (
                  <div className="mb-16">
                    <IndustrySection relevantIndustries={relevantIndustries} />
                  </div>
                )}

                {/* FAQ Section */}
                {faqs && faqs.length > 0 && (
                  <div className="mb-16">
                    <FaqSection faqs={faqs} />
                  </div>
                )}

                {/* CTA Box */}
                <div className="bg-muted/30 p-8 rounded-xl border border-border">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to get started?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Contact our data science team to learn more about our {serviceData.name}{" "}
                    and how we can help your business leverage data for better outcomes.
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
                {/* Services Category Box */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-muted/20 rounded-xl border border-border p-6"
                >
                  <h3 className="text-xl font-bold mb-4">Data Science Services</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore our full range of data science services
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/services/data-science">
                      All Data Science Services
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>

                {/* Testimonials Section */}
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

                {/* Related Services */}
                {relatedServices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-muted/20 rounded-xl border border-border p-6"
                  >
                    <h3 className="text-xl font-bold mb-4">Related Services</h3>
                    <div className="space-y-4">
                      {relatedServices.map((service) => (
                        <Link
                          key={service.id}
                          href={`/services/data-science/${service.id}`}
                          className="block p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20"
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{service.name}</p>
                            <ArrowRight className="h-4 w-4 text-primary" />
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

      {/* CTA Section */}
      <section className="py-16 md:py-24 text-white relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-600 to-violet-700 overflow-hidden">
          {/* Animated circular elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full bg-gradient-to-r from-blue-500/0 via-blue-400/20 to-blue-500/0 animate-slow-spin"></div>

          {/* Wave effect */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%]">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>
          </div>

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('/grid.png')]"></div>

          {/* Light beams */}
          <div className="absolute left-1/4 top-0 w-[2px] h-full bg-gradient-to-b from-white/30 via-white/10 to-transparent"></div>
          <div className="absolute left-2/3 top-0 w-[1px] h-full bg-gradient-to-b from-white/20 via-white/5 to-transparent"></div>
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
              Transform Your Business with Data Science
            </motion.h2>

            <motion.p
              className="text-xl text-white/80 mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Let our team of experienced data scientists help you unlock the full potential of your data for better decision-making and business growth.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
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
                    href="/services/data-science"
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
