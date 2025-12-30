"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Car,
  Stethoscope,
  ShoppingBag,
  Factory,
  Zap,
  Landmark,
  Phone,
  Rocket,
  Truck,
  Film,
  Pill,
  Building2,
  Utensils,
  Ship,
  BarChart2,
  Beaker,
  Bed,
  Wheat,
  Shield,
  GraduationCap,
  Plane,
  Construction,
  Store,
  Map,
  Folder,
} from "lucide-react";

// Import modular components
import HeroSection from "@/components/industries/HeroSection";
import IndustriesOverview from "@/components/industries/IndustriesOverview";
import DetailedIndustrySection from "@/components/industries/DetailedIndustrySection";
import AllIndustriesGrid from "@/components/industries/AllIndustriesGrid";
import IndustryCtaSection from "@/components/industries/IndustryCtaSection";

// Complete industry data with Lucide icons
const industriesData = [
  {
    id: "healthcare",
    name: "Healthcare",
    icon: Stethoscope,
    description:
      "Transform patient care and operational efficiency with SAP solutions tailored for healthcare providers and organizations.",
    challenges: [
      "Complex regulatory compliance requirements",
      "Patient data management and security",
      "Integration with specialized medical systems",
      "Revenue cycle management",
      "Operational efficiency in resource allocation",
    ],
    solutions: [
      "SAP Healthcare industry solutions",
      "Electronic medical records integration",
      "Compliance-focused implementations",
      "Patient management systems",
      "Healthcare analytics and reporting",
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: Factory,
    description:
      "Streamline production processes and optimize supply chains with comprehensive SAP solutions for manufacturers.",
    challenges: [
      "Complex supply chain management",
      "Production planning and scheduling",
      "Quality management and compliance",
      "Inventory optimization",
      "Equipment maintenance and reliability",
    ],
    solutions: [
      "SAP S/4HANA Manufacturing solutions",
      "Production planning and execution systems",
      "Supply chain optimization",
      "Quality management modules",
      "Predictive maintenance solutions",
    ],
  },
  {
    id: "finance",
    name: "Financial Services",
    icon: Landmark,
    description:
      "Enhance financial operations, reporting, and compliance with specialized SAP solutions for financial institutions.",
    challenges: [
      "Regulatory compliance and reporting",
      "Risk management",
      "Customer relationship management",
      "Transaction processing efficiency",
      "Fraud detection and prevention",
    ],
    solutions: [
      "SAP Financial Services solutions",
      "Regulatory reporting automation",
      "Customer experience platforms",
      "Financial analytics and dashboards",
      "Risk management systems",
    ],
  },
  {
    id: "retail",
    name: "Retail",
    icon: ShoppingBag,
    description:
      "Transform customer experiences and streamline retail operations with SAP solutions designed for modern retailers.",
    challenges: [
      "Omnichannel customer experience",
      "Inventory and supply chain management",
      "Point of sale integration",
      "Pricing and promotion management",
      "Customer loyalty programs",
    ],
    solutions: [
      "SAP Retail solutions",
      "Omnichannel commerce platforms",
      "Merchandise management systems",
      "Customer experience solutions",
      "Retail analytics and forecasting",
    ],
  },
  {
    id: "energy",
    name: "Energy",
    icon: Zap,
    description:
      "Optimize operations and manage assets efficiently with SAP solutions tailored for energy companies.",
    challenges: [
      "Asset management and maintenance",
      "Commodity trading and risk management",
      "Regulatory compliance",
      "Supply chain optimization",
      "Sustainability reporting",
    ],
    solutions: [
      "SAP for Energy & Natural Resources",
      "Asset management solutions",
      "Trading and risk management platforms",
      "Regulatory compliance systems",
      "Sustainability reporting frameworks",
    ],
  },
  {
    id: "automotive",
    name: "Automotive",
    icon: Car,
    description:
      "Drive innovation and efficiency in automotive manufacturing and supply chains with specialized SAP solutions.",
    challenges: [
      "Complex global supply chains",
      "Just-in-time manufacturing",
      "Quality management and recalls",
      "Product lifecycle management",
      "Dealership management",
    ],
    solutions: [
      "SAP Automotive solutions",
      "Supply chain visibility systems",
      "Quality management modules",
      "Manufacturing execution systems",
      "Dealership management platforms",
    ],
  },
  {
    id: "pharmaceuticals",
    name: "Pharmaceuticals",
    icon: Pill,
    description:
      "Address regulatory compliance and streamline research and development with SAP solutions for pharmaceutical companies.",
    challenges: [
      "Complex regulatory compliance",
      "R&D management and tracking",
      "Clinical trial management",
      "Supply chain integrity",
      "Patent management",
    ],
    solutions: [
      "SAP Life Sciences solutions",
      "Compliance and validation tools",
      "R&D management platforms",
      "Supply chain traceability",
      "Patent and intellectual property management",
    ],
  },
  {
    id: "telecom",
    name: "Telecommunications",
    icon: Phone,
    description:
      "Enhance service delivery and customer experience with SAP solutions designed for telecommunications providers.",
    challenges: [
      "Complex billing and subscription management",
      "Network asset management",
      "Customer experience and retention",
      "Service provisioning",
      "Regulatory compliance",
    ],
    solutions: [
      "SAP Telecommunications solutions",
      "Billing and revenue management",
      "Customer experience platforms",
      "Network asset management",
      "Service delivery optimization",
    ],
  },
  {
    id: "logistics",
    name: "Logistics",
    icon: Truck,
    description:
      "Optimize transportation, warehousing, and distribution with SAP solutions for logistics companies.",
    challenges: [
      "Real-time tracking and visibility",
      "Route optimization",
      "Warehouse management",
      "Cross-border compliance",
      "Fleet management",
    ],
    solutions: [
      "SAP Transportation Management",
      "SAP Extended Warehouse Management",
      "Supply chain visibility platforms",
      "Fleet management solutions",
      "Logistics analytics and planning",
    ],
  },
  {
    id: "construction",
    name: "Construction",
    icon: Building2,
    description:
      "Manage complex projects, resources, and compliance with SAP solutions tailored for construction companies.",
    challenges: [
      "Project management and scheduling",
      "Resource allocation",
      "Compliance and safety management",
      "Subcontractor management",
      "Equipment tracking and maintenance",
    ],
    solutions: [
      "SAP for Engineering, Construction & Operations",
      "Project management solutions",
      "Resource planning and allocation",
      "Compliance tracking and reporting",
      "Equipment management systems",
    ],
  },
  {
    id: "media",
    name: "Media & Entertainment",
    icon: Film,
    description:
      "Manage content, monetize assets, and engage audiences with SAP solutions for media companies.",
    challenges: [
      "Content management and rights",
      "Audience engagement and analytics",
      "Digital asset management",
      "Subscription and revenue models",
      "Multi-channel delivery",
    ],
    solutions: [
      "SAP for Media solutions",
      "Content management systems",
      "Digital asset management",
      "Audience analytics platforms",
      "Subscription management systems",
    ],
  },
  {
    id: "food",
    name: "Food & Beverage",
    icon: Utensils,
    description:
      "Ensure quality, safety, and supply chain integrity with SAP solutions for food and beverage companies.",
    challenges: [
      "Quality control and safety",
      "Supply chain traceability",
      "Regulatory compliance",
      "Inventory management",
      "Recipe and formula management",
    ],
    solutions: [
      "SAP for Consumer Products",
      "Quality management systems",
      "Track and trace solutions",
      "Recipe management platforms",
      "Compliance and documentation management",
    ],
  },
  {
    id: "shipping",
    name: "Shipping",
    icon: Ship,
    description:
      "Optimize maritime operations and supply chains with SAP solutions for shipping companies.",
    challenges: [
      "Fleet management",
      "Port operations",
      "International compliance",
      "Cargo tracking",
      "Crew management",
    ],
    solutions: [
      "SAP for Transportation & Logistics",
      "Maritime operations management",
      "International trade compliance",
      "Cargo tracking systems",
      "Crew scheduling and management",
    ],
  },
  {
    id: "trading",
    name: "Trading",
    icon: BarChart2,
    description:
      "Enhance trading operations, risk management, and compliance with specialized SAP solutions.",
    challenges: [
      "Real-time data processing",
      "Risk management",
      "Regulatory compliance",
      "Transaction processing",
      "Market analysis",
    ],
    solutions: [
      "SAP Treasury and Risk Management",
      "Trading platforms integration",
      "Regulatory reporting automation",
      "Risk analytics solutions",
      "Market data integration",
    ],
  },
  {
    id: "chemical",
    name: "Chemical",
    icon: Beaker,
    description:
      "Streamline production processes and ensure compliance with SAP solutions for chemical manufacturers.",
    challenges: [
      "Safety and environmental compliance",
      "Process manufacturing optimization",
      "Product formulation management",
      "Quality control",
      "Supply chain transparency",
    ],
    solutions: [
      "SAP for Chemicals",
      "Process manufacturing management",
      "Formula and recipe management",
      "Quality control systems",
      "Compliance and documentation management",
    ],
  },
  {
    id: "hospitality",
    name: "Hospitality",
    icon: Bed,
    description:
      "Enhance guest experiences and streamline operations with SAP solutions for hospitality companies.",
    challenges: [
      "Guest experience management",
      "Property management",
      "Revenue optimization",
      "Staff scheduling and management",
      "Inventory and procurement",
    ],
    solutions: [
      "SAP for Travel and Transportation",
      "Property management integration",
      "Revenue management systems",
      "Staff scheduling solutions",
      "Inventory and procurement management",
    ],
  },
  {
    id: "agriculture",
    name: "Agriculture",
    icon: Wheat,
    description:
      "Optimize farming operations and supply chains with SAP solutions for agricultural businesses.",
    challenges: [
      "Crop planning and management",
      "Weather integration and risk management",
      "Supply chain traceability",
      "Equipment management",
      "Compliance and reporting",
    ],
    solutions: [
      "SAP for Agribusiness",
      "Farm management systems",
      "Weather data integration",
      "Supply chain tracking",
      "Equipment maintenance and scheduling",
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: Shield,
    description:
      "Streamline policy management, claims processing, and customer service with SAP solutions for insurance companies.",
    challenges: [
      "Policy management",
      "Claims processing efficiency",
      "Risk assessment and pricing",
      "Customer relationship management",
      "Fraud detection",
    ],
    solutions: [
      "SAP Insurance solutions",
      "Policy administration systems",
      "Claims automation platforms",
      "Risk assessment tools",
      "Customer engagement solutions",
    ],
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    description:
      "Enhance administrative efficiency and student experiences with SAP solutions for educational institutions.",
    challenges: [
      "Student lifecycle management",
      "Financial aid processing",
      "Faculty and staff management",
      "Campus operations",
      "Compliance and reporting",
    ],
    solutions: [
      "SAP for Higher Education & Research",
      "Student information systems",
      "Financial management solutions",
      "Human capital management",
      "Campus management platforms",
    ],
  },
];

export default function IndustriesPage() {
  // State for industry filtering and interaction
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredIndustries, setFilteredIndustries] = useState(industriesData);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [visibleDetailCount, setVisibleDetailCount] = useState(6);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Reference for scrolling
  const overviewRef = useRef(null);

  // Filter industries based on active filter
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredIndustries(industriesData);
      return;
    }

    // Example filter logic - in a real app, you'd have tags/categories for each industry
    const filterMap = {
      manufacturing: [
        "manufacturing",
        "automotive",
        "chemical",
        "food",
        "pharmaceuticals",
      ],
      services: [
        "hospitality",
        "telecom",
        "media",
        "education",
        "logistics",
        "shipping",
      ],
      retail: ["retail", "food", "trading"],
      healthcare: ["healthcare", "pharmaceuticals"],
      finance: ["finance", "insurance", "trading"],
    };

    setFilteredIndustries(
      industriesData.filter(
        (industry) =>
          filterMap[activeFilter] &&
          filterMap[activeFilter].includes(industry.id)
      )
    );
  }, [activeFilter]);

  // Handle industry selection
  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    // Smooth scroll to the industry detail section
    document.getElementById(industry.id).scrollIntoView({ behavior: "smooth" });
  };

  // Reset filters
  const resetFilters = () => {
    setActiveFilter("all");
    setSelectedIndustry(null);
  };

  // Load more industries
  const loadMoreIndustries = () => {
    setVisibleDetailCount((prev) => Math.min(prev + 3, industriesData.length));
  };

  // Handler for the Explore Industries button
  const handleExploreClick = () => {
    overviewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Progress bar for smooth scrolling */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <HeroSection onExploreClick={handleExploreClick} />

      {/* Industries Overview with Filtering */}
      <IndustriesOverview
        ref={overviewRef}
        industries={filteredIndustries}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        resetFilters={resetFilters}
      />

      {/* Detailed Industry Sections - Limited to visible count with load more button */}
      <div className="bg-muted/10">
        {industriesData.slice(0, visibleDetailCount).map((industry, index) => (
          <DetailedIndustrySection
            key={industry.id}
            industry={industry}
            index={index}
          />
        ))}

        {/* Load More Button */}
        {visibleDetailCount < industriesData.length && (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={loadMoreIndustries}
                variant="outline"
                size="lg"
                className="gap-2 shadow-sm hover:shadow-md"
              >
                Load More Industries
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* All Industries Grid View */}
      <AllIndustriesGrid industries={industriesData} />

      {/* Enhanced CTA Section */}
      <IndustryCtaSection />
    </>
  );
}
