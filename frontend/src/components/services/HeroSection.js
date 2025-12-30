"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Palette, Code, Megaphone, BarChart, Users } from 'lucide-react';
import ExpandableCard from '@/components/ui/ExpandableCard';

// Mock data
const heroData = {
  services: {
    tagline: "Our Services",
    title: "OUR SERVICES",
    description: "From implementation to support, our range of services covers all aspects of SAP to help you achieve your digital transformation goals.",
    cards: [
      {
        id: 1,
        title: "SAP S/4HANA",
        color: "bg-gradient-to-br from-purple-500 to-purple-700",
        details: {
          description: "Next-generation ERP suite that transforms your business processes with intelligent automation and real-time insights.",
          features: ["Digital Core Implementation", "Migration Services", "Process Optimization", "Real-time Analytics"],
        }
      },
      {
        id: 2,
        title: "SAP BTP",
        color: "bg-gradient-to-br from-blue-500 to-blue-700",
        details: {
          description: "Business Technology Platform that connects data, processes, and people to accelerate digital transformation.",
          features: ["Integration Platform", "Extension Development", "Data & Analytics", "AI/ML Services"],
        }
      },
      {
        id: 3,
        title: "SAP B1",
        color: "bg-gradient-to-br from-orange-500 to-red-600",
        details: {
          description: "Comprehensive business management solution designed specifically for small and medium enterprises.",
          features: ["Financial Management", "Sales & CRM", "Inventory Control", "Reporting & Analytics"],
        }
      },
      {
        id: 4,
        title: "SAP FICO",
        color: "bg-gradient-to-br from-green-500 to-emerald-600",
        details: {
          description: "Financial accounting and controlling module that provides complete financial management capabilities.",
          features: ["General Ledger", "Accounts Payable/Receivable", "Cost Center Accounting", "Financial Reporting"],
        }
      },
      {
        id: 5,
        title: "SAP Consulting", 
        color: "bg-gradient-to-br from-indigo-500 to-purple-600",
        details: {
          description: "Expert SAP consulting services to guide your digital transformation journey and optimize business processes.",
          features: ["Implementation Strategy", "Process Optimization", "Change Management", "Training & Support"],
        }
      }
    ]
  }
};

export default function HeroSection() {
  const { tagline, title, description, cards } = heroData.services;
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="py-12 md:py-16 relative bg-white dark:bg-black overflow-hidden">
      {/* Subtle animated background */}
      {/* Enhanced glassmorphism background with gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-500/8 to-indigo-500/8 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-0 sm:right-10 w-52 h-52 sm:w-80 sm:h-80 bg-gradient-to-r from-cyan-500/6 to-blue-600/6 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-4 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-blue-600/6 to-sky-500/6 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] sm:w-[600px] sm:h-[600px] max-w-[600px] max-h-[600px] bg-gradient-to-r from-blue-400/4 to-cyan-400/4 rounded-full filter blur-3xl opacity-30 dark:opacity-20"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 xl:px-12 relative z-10 h-full max-w-7xl">
        {/* Mobile View - Vertical Cards */}
        <div className="lg:hidden flex flex-col py-4 px-4 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-md shadow-lg shadow-blue-900/15 px-4 py-2 text-sm font-medium text-white mb-4">
              <motion.span 
                className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {heroData.services.tagline}
            </div>
            
            <h1 className="text-3xl font-extrabold mb-3 text-white tracking-tight">
              {heroData.services.title}
            </h1>
            
            <p className="text-base text-gray-300 mb-8 leading-relaxed px-2">
              {heroData.services.description}
            </p>
          </motion.div>

          {/* Vertical Cards Stack */}
          <div className="flex-1 overflow-y-auto pb-6 -mx-2">
            <div className="space-y-4 px-2">
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full h-48 bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-xl rounded-2xl shadow-lg shadow-blue-900/30 overflow-hidden border border-blue-300/15 relative"
                >
                  <div className="absolute inset-0 bg-cover bg-center" style={{
                    backgroundImage: `url(${
                      index === 0 ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757746274/The-10-Biggest-Technology-Trends-That-Will-Transform-The-Next-Decade_kd5zio.jpg' :
                      index === 1 ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757746640/loi-ich-cua-SAP_nsfvdy.webp' :
                      index === 2 ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757661617/90983c0228417c6649e48be1b3ceefe9_bjzkal.jpg' :
                      index === 3 ? 'https://res.cloudinary.com/deni4qbla/image/upload/v1757746821/strapi-assets-tech_a34b41e7f9_kcehed.jpg' :
                      'https://res.cloudinary.com/deni4qbla/image/upload/v1757747156/digital_technology_background_modern_silhouette_3d_design_6837527_cvachc.jpg'
                    })`
                  }}>
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                  </div>
                  
                  <div className="relative z-10 p-5 h-full flex flex-col justify-end">
                    <h3 className="text-white font-bold text-lg mb-1">{card.title}</h3>
                    <p className="text-sm text-gray-200 mb-3 line-clamp-2">{card.details.description}</p>
                    <button className="mt-auto w-fit py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors flex items-center">
                      Learn More
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop View - Original Layout */}
        <div className="hidden lg:flex flex-col lg:flex-row gap-4 xl:gap-8 items-start justify-between w-full mx-auto overflow-x-hidden">
          
          {/* Left Side - Content */}
          <motion.div
            className="relative overflow-hidden flex-shrink-0"
            style={{ width: '100%' }}
            initial={false}
            animate={{ width: hoveredCard !== null ? '0%' : '45%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 25, mass: 0.8 }}
          >
            <motion.div
              key="main-content"
              initial="visible"
              animate={{
                opacity: hoveredCard !== null ? 0 : 1,
                x: hoveredCard !== null ? -20 : 0,
                filter: hoveredCard !== null ? "blur(1px)" : "blur(0px)"
              }}
              transition={{ 
                type: 'spring',
                stiffness: 100,
                damping: 20,
                mass: 0.6
              }}
              style={{ 
                pointerEvents: hoveredCard !== null ? 'none' : 'auto',
                maxWidth: '100%',
                width: '100%',
                boxSizing: 'border-box'
              }}
              className="pt-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.1,
                  ease: [0.25, 0.1, 0.25, 1.0]
                }}
                className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-md shadow-lg shadow-blue-900/15 px-4 py-2 text-sm font-medium text-white mb-6"
              >
                <motion.span 
                  className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {tagline}
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2,
                  ease: [0.25, 0.1, 0.25, 1.0]
                }}
                className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight"
              >
                {title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.3,
                  ease: [0.25, 0.1, 0.25, 1.0]
                }}
                className="text-lg text-gray-300 mb-8 leading-relaxed"
              >
                {description}
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Right Side - Cards */}
          <motion.div 
            className="relative overflow-visible w-full"
            style={{ width: '100%', minHeight: '500px' }}
            initial={false}
            animate={{ width: hoveredCard !== null ? '100%' : '55%' }}
            transition={{ type: 'spring', stiffness: 120, damping: 25, mass: 0.8 }}
          >
            <div className="flex flex-nowrap gap-3 items-center overflow-x-auto overflow-y-visible transition-all duration-300 ease-out scrollbar-hide w-full" style={{
              justifyContent: hoveredCard !== null ? 'flex-start' : 'center',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              scrollBehavior: 'smooth',
              minHeight: '500px'
            }}>
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ 
                    opacity: 0, 
                    y: 50,
                    rotateY: -15
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateY: 0,
                    x: hoveredCard !== null && hoveredCard > index ? -5 : 
                       hoveredCard !== null && hoveredCard < index ? 5 : 0
                  }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                    mass: 0.6
                  }}
                  className="group relative flex-shrink-0 overflow-visible transform-gpu"
                  style={{ 
                    zIndex: hoveredCard === index ? 100 : 10 - index,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform'
                  }}
                  onMouseEnter={() => {
                    setHoveredCard(index);
                  }}
                  onMouseLeave={() => {
                    setHoveredCard(null);
                  }}
                >
                  <motion.div
                    layout
                    animate={{
                      width: hoveredCard === index ? (typeof window !== 'undefined' && window.innerWidth >= 1280 ? 400 : 350) : 100,
                      height: 480,
                      marginRight: hoveredCard === index ? '2rem' : '0',
                      scale: hoveredCard !== null && hoveredCard !== index ? 0.95 : 1,
                      opacity: hoveredCard !== null && hoveredCard !== index ? 0.7 : 1,
                    }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 100,
                      damping: 20,
                      mass: 0.6
                    }}
                    className="bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-900/30 cursor-pointer relative overflow-hidden border border-blue-300/15 hover:border-blue-200/30 will-change-transform flex-shrink-0"
                  >
                    {/* Glassmorphism inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/5 rounded-2xl"></div>
                    
                    {/* Background image for first card */}
                    {index === 0 && (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center rounded-2xl"
                          style={{
                            backgroundImage: 'url(https://res.cloudinary.com/deni4qbla/image/upload/v1757746274/The-10-Biggest-Technology-Trends-That-Will-Transform-The-Next-Decade_kd5zio.jpg)'
                          }}
                        >
                          <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-blue-900/70 via-blue-900/50 to-transparent rounded-b-2xl"></div>
                      </>
                    )}
                    
                    {/* Background image for second card */}
                    {index === 1 && (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center rounded-2xl"
                          style={{
                            backgroundImage: 'url(https://res.cloudinary.com/deni4qbla/image/upload/v1757746640/loi-ich-cua-SAP_nsfvdy.webp)'
                          }}
                        >
                          <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-900/70 via-blue-800/50 to-transparent rounded-b-2xl" style={{ height: '45%' }}></div>
                      </>
                    )}

                    {/* Background image for third card */}
                    {index === 2 && (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center rounded-2xl"
                          style={{
                            backgroundImage: 'url(https://res.cloudinary.com/deni4qbla/image/upload/v1757661617/90983c0228417c6649e48be1b3ceefe9_bjzkal.jpg)'
                          }}
                        >
                          <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-900/70 via-blue-800/50 to-transparent rounded-b-2xl" style={{ height: '65%' }}></div>
                      </>
                    )}
                    
                    {/* Background image for fourth card */}
                    {index === 3 && (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center rounded-2xl"
                          style={{
                            backgroundImage: 'url(https://res.cloudinary.com/deni4qbla/image/upload/v1757746821/strapi-assets-tech_a34b41e7f9_kcehed.jpg)'
                          }}
                        >
                          <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-900/80 via-blue-800/50 to-transparent rounded-b-2xl" style={{ height: '80%' }}></div>
                      </>
                    )}
                    
                    {/* Background image for fifth card */}
                    {index === 4 && (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center rounded-2xl"
                          style={{
                            backgroundImage: 'url(https://res.cloudinary.com/deni4qbla/image/upload/v1757747156/digital_technology_background_modern_silhouette_3d_design_6837527_cvachc.jpg)'
                          }}
                        >
                          <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-900/90 via-blue-800/60 to-transparent rounded-b-2xl" style={{ height: '90%' }}></div>
                      </>
                    )}
                    
                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col">
                      
                      {/* Vertical title for collapsed state */}
                      {hoveredCard !== index && (
                        <motion.div
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <motion.h3 
                            className="text-sm font-bold text-white whitespace-nowrap drop-shadow-lg"
                            style={{ transform: "rotate(90deg)" }}
                          >
                            {card.title}
                          </motion.h3>
                        </motion.div>
                      )}

                      {/* Expanded content */}
                      {hoveredCard === index && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            duration: 0.3,
                            delay: 0.1,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                          className="h-full flex flex-col justify-between"
                        >
                          <div className="space-y-4">
                            <motion.h4 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.3,
                                delay: 0.15,
                                ease: [0.4, 0, 0.2, 1]
                              }}
                              className="text-white font-bold text-xl drop-shadow-lg"
                            >
                              {card.title}
                            </motion.h4>
                            
                            <motion.p 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ 
                                duration: 0.3,
                                delay: 0.2,
                                ease: [0.4, 0, 0.2, 1]
                              }}
                              className="text-white/90 text-sm leading-relaxed drop-shadow-md"
                            >
                              {card.details.description}
                            </motion.p>
                          </div>

                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              duration: 0.3,
                              delay: 0.25,
                              ease: [0.4, 0, 0.2, 1]
                            }}
                            className="space-y-3"
                          >
                            <h5 className="text-white font-semibold text-sm drop-shadow-md">Key Features:</h5>
                            <ul className="space-y-2">
                              {card.details.features.map((feature, i) => (
                                <motion.li 
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ 
                                    duration: 0.2,
                                    delay: 0.3 + (i * 0.05),
                                    ease: [0.4, 0, 0.2, 1]
                                  }}
                                  className="text-white/80 text-xs flex items-center gap-2 drop-shadow-sm"
                                >
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70 shadow-lg" />
                                  {feature}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}