const testimonials = {
  consulting: [
    {
      name: "Rajiv Mehta",
      role: "CIO",
      company: "Global Technologies Ltd.",
      image: null,
      content: "Atorix IT's business consulting services transformed our approach to SAP implementation. Their strategic insights helped us align technology with our business goals, resulting in a 30% improvement in operational efficiency.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Operations Director",
      company: "Infinite Solutions",
      image: null,
      content: "The process consulting team at Atorix IT identified inefficiencies in our workflows that we hadn't even noticed. Their recommendations have streamlined our business processes and considerably reduced manual effort.",
      rating: 5
    },
    {
      name: "Vikram Singh",
      role: "Technology Head",
      company: "NextGen Enterprises",
      image: null,
      content: "Their technology consulting expertise helped us make informed decisions about our SAP ecosystem. The roadmap they created perfectly aligned with our business growth trajectory.",
      rating: 4
    }
  ],
  "erp-tech": [
    {
      name: "Sandeep Kumar",
      role: "IT Director",
      company: "Pioneer Industries",
      image: null,
      content: "Our S/4 HANA implementation with Atorix IT was incredibly smooth. Their team's expertise and methodical approach ensured we leveraged the full potential of the platform from day one.",
      rating: 5
    },
    {
      name: "Neha Patel",
      role: "CFO",
      company: "Skyline Corporation",
      image: null,
      content: "Moving to SAP S/4 HANA Cloud with Atorix IT has given us unprecedented flexibility and cost efficiency. Their cloud expertise was evident throughout the project.",
      rating: 5
    },
    {
      name: "Ajay Verma",
      role: "CEO",
      company: "Rapid Growth Solutions",
      image: null,
      content: "As a growing business, SAP Business One was perfect for our needs. Atorix IT implemented a solution tailored to our unique requirements that scales with our business.",
      rating: 5
    }
  ],
  "sap-application": [
    {
      name: "Meera Reddy",
      role: "CTO",
      company: "Integrated Systems Ltd.",
      image: null,
      content: "The implementation and rollout service from Atorix IT exceeded our expectations. Their team's attention to detail and problem-solving skills turned potential challenges into opportunities for improvement.",
      rating: 5
    },
    {
      name: "Kiran Desai",
      role: "SAP Manager",
      company: "Precision Manufacturing",
      image: null,
      content: "We've been getting SAP support from Atorix more than a year now. Their technical and functional teams consistently deliver timely services and resolutions for all types of requirements.",
      rating: 4
    },
    {
      name: "Suresh Menon",
      role: "Digital Transformation Lead",
      company: "Innovation Tech",
      image: null,
      content: "The S/4 HANA migration was a critical project for us, and Atorix IT managed it perfectly. Their expertise minimized disruption and ensured a smooth transition to the new system.",
      rating: 5
    }
  ],
  "microsoft-dynamics": [
    {
      name: "Ashok Malhotra",
      role: "Head of IT",
      company: "Diverse Enterprises",
      image: null,
      content: "Atorix IT's Microsoft Dynamics 365 implementation has transformed our business operations. Their team's expertise in configuring the platform to our specific needs was impressive.",
      rating: 5
    },
    {
      name: "Leela Krishna",
      role: "Operations Manager",
      company: "Future Retail Ltd.",
      image: null,
      content: "The Dynamics 365 solution provided by Atorix IT has given us a comprehensive view of our customer journey, enabling us to make data-driven decisions and improve customer satisfaction.",
      rating: 4
    }
  ],
  security: [
    {
      name: "Harish Chandra",
      role: "CISO",
      company: "Secure Financial Services",
      image: null,
      content: "Atorix IT's cybersecurity services have significantly strengthened our security posture. Their proactive approach to threat detection and incident response gives us peace of mind.",
      rating: 5
    },
    {
      name: "Rama Moorthy",
      role: "IT Security Manager",
      company: "Data Protection Inc.",
      image: null,
      content: "The security assessment conducted by Atorix IT uncovered vulnerabilities we weren't aware of. Their remediation plan was comprehensive and practical to implement.",
      rating: 5
    }
  ]
};

// Function to get testimonials by category
export const getTestimonialsByCategory = (categoryId) => {
  return testimonials[categoryId] || [];
};

// Function to get testimonials for a specific service
export const getTestimonialsForService = (categoryId, serviceId) => {
  const categoryTestimonials = testimonials[categoryId] || [];

  // For now, we return category testimonials, but this can be expanded
  // to filter by service-specific testimonials when available
  return categoryTestimonials;
};

// Export all testimonials for general use
export default testimonials;
