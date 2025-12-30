"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useTheme } from "@/components/ui/theme-provider";
import { motion } from "framer-motion";

import servicesData from "@/data/services.json";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Industries", path: "/industries" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
  { name: "Careers", path: "/career" },
];

export function NeonLogoBorder({ width = 110, height = 30, className = "", isMobile = false }) {
  const { theme } = useTheme();
  const containerSize = isMobile ? "p-0.5" : "p-0.5";
  const innerPadding = isMobile ? "p-1.5" : "p-1.5";
  const logoContainerClass = `relative ${containerSize} ${className} flex items-center justify-center`;
  
  const isLightMode = theme === 'light';
  const logoBackgroundColor = isLightMode ? 'bg-white' : 'bg-black';
  
  return (
    <div className={logoContainerClass}>
      <div className="absolute inset-0 rounded-full overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 rounded-full animated-border-layer" />
      </div>
      
      <div className={`relative rounded-full ${logoBackgroundColor} ${innerPadding} flex items-center justify-center z-10 overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 z-20 animate-shine" />
        
        <div className="flex items-center z-30">
          <div className="flex items-center">
            <div className="relative w-10 h-10 -ml-1">
              <Image
                src={isLightMode ? "/atorix-logo-old.png" : "/atorix-logo.png"}
                alt="Atorix Logo"
                fill
                className="relative z-30 object-contain"
                priority
              />
            </div>
            <Image
              src={isLightMode ? "/crop_logo.webp.webp" : "/atorix text logo@3x.webp"}
              alt="Atorix"
              width={width - 25}
              height={height}
              className="object-contain relative z-30 -ml-1"
              priority
            />
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @property --gradient-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        .animated-border-layer {
          background: conic-gradient(
            from var(--gradient-angle),
            transparent 0deg,
            #f12711 60deg,
            #f5af19 120deg,
            transparent 180deg,
            #402fb5 240deg,
            #cf30aa 300deg,
            transparent 360deg
          );
          animation: rotate-gradient 6s linear infinite;
        }

        @keyframes rotate-gradient {
          0% { --gradient-angle: 0deg; }
          100% { --gradient-angle: 360deg; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(150%) skewX(-12deg); }
        }
        
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }

        .sticky-navbar {
          overflow: visible !important;
          z-index: 9999 !important;
        }
        
        .sticky-navbar .dropdown-menu {
          position: absolute !important;
          z-index: 10000 !important;
          display: block !important;
        }
      `}</style>
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const sheetCloseRef = useRef(null);
  
  const [openCategory, setOpenCategory] = useState(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const timeoutRef = useRef(null);
  const subMenuTimeoutRef = useRef(null);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const isIndustriesPage = pathname === "/industries";
  const isServicePath = pathname.startsWith("/services");
  const isBlogPath = pathname.includes("/blog");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSheetOpen && sheetCloseRef.current) {
      sheetCloseRef.current.click();
      setIsSheetOpen(false);
    }
  }, [pathname, isSheetOpen]);

  const handleServicesMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
      setOpenCategory(null);
    }, 200);
  };

  const handleCategoryMouseEnter = (categoryId) => {
    if (subMenuTimeoutRef.current) {
      clearTimeout(subMenuTimeoutRef.current);
      subMenuTimeoutRef.current = null;
    }
    setOpenCategory(categoryId);
  };

  const handleCategoryMouseLeave = () => {
    subMenuTimeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 200);
  };

  const handleDropdownClick = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (subMenuTimeoutRef.current) {
      clearTimeout(subMenuTimeoutRef.current);
      subMenuTimeoutRef.current = null;
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleSheetOpenChange = (open) => {
    setIsSheetOpen(open);
  };

  const closeSheet = () => {
    if (sheetCloseRef.current) {
      sheetCloseRef.current.click();
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 10 },
    },
  };

  return (
    <>
      {/* FIRST NAVBAR */}
      <header className={`fixed top-0 z-50 w-full transition-all duration-100 ease-in-out bg-white dark:bg-black ${
        isScrolled || isSheetOpen ? 'opacity-0 pointer-events-none transform -translate-y-full' : 'opacity-100 pointer-events-auto transform translate-y-0'
      }`}>
        <div className="transition-all duration-100 ease-in-out overflow-visible">
          <div className="container mx-auto">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
                <NeonLogoBorder width={100} height={28} />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                {navLinks.slice(0, 2).map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm font-medium transition-colors hover:text-[#DF7D13] ${
                      pathname === link.path ? "font-semibold" : "text-foreground/80"
                    }`}
                    style={pathname === link.path ? {color: '#DF7D13'} : {}}
                  >
                    {link.name}
                  </Link>
                ))}

                <div
                  className="relative"
                  ref={servicesRef}
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                  onClick={handleDropdownClick}
                >
                  <button
                    className={`flex items-center text-sm font-medium transition-colors hover:text-[#DF7D13] ${
                      isServicePath ? "font-semibold" : "text-foreground/80"
                    }`}
                    style={isServicePath ? {color: '#DF7D13'} : {}}
                  >
                    <Link href="/services">Services</Link>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>

                  {isServicesOpen && (
                    <div className="absolute left-0 top-full pt-2 z-50">
                      <div className="w-64 bg-popover rounded-md border shadow-md p-1.5">
                        <div className="space-y-0.5 py-1">
                          {servicesData.categories.map((category) => (
                            <div
                              key={category.id}
                              className="relative"
                              onMouseEnter={() => handleCategoryMouseEnter(category.id)}
                              onMouseLeave={handleCategoryMouseLeave}
                            >
                              <div className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer">
                                <span>{category.name}</span>
                                <ChevronDown className="ml-auto h-4 w-4 -rotate-90" />
                              </div>

                              {openCategory === category.id && (
                                <div className="absolute top-0 left-full pl-1.5">
                                  <div className="w-64 bg-popover rounded-md border shadow-md p-1.5">
                                    <div className="space-y-0.5 py-1">
                                      {category.services.map((service) => (
                                        <Link
                                          key={service.id}
                                          href={`/services/${category.id}/${service.id}`}
                                          className="block px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
                                        >
                                          {service.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {navLinks.slice(2).map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`text-sm font-medium transition-colors hover:text-[#DF7D13] ${
                      pathname === link.path || (link.path === "/blog" && isBlogPath)
                        ? "font-semibold" : "text-foreground/80"
                    }`}
                    style={(pathname === link.path || (link.path === "/blog" && isBlogPath)) ? {color: '#DF7D13'} : {}}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Get Demo Button - Visible on all screen sizes */}
                <motion.div variants={itemVariants} className="flex items-center">
                  <Button
                    asChild
                    className="gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-gradient-hero shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden group btn-3d whitespace-nowrap"
                  >
                    <Link href="/get-demo">
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-white/30 to-primary/0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000"></span>
                      <span className="relative z-10 flex items-center">
                        Get Demo
                      </span>
                    </Link>
                  </Button>
                </motion.div>

                <ThemeToggle />

                {/* Mobile Menu */}
                <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="icon" aria-label="Menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[300px] sm:w-[400px] overflow-y-auto max-h-screen p-0"
                  >
                    <div className="flex flex-col h-full py-6 px-6">
                      <div className="flex items-center justify-between mb-8">
                        <NeonLogoBorder width={100} height={28} />
                        <SheetClose ref={sheetCloseRef} className="hidden" />
                      </div>

                      <nav className="flex flex-col space-y-6 mb-auto">
                        {navLinks.slice(0, 2).map((link) => (
                          <Link
                            key={link.path}
                            href={link.path}
                            className={`text-base font-medium transition-colors hover:text-primary ${
                              pathname === link.path
                                ? "text-primary font-semibold"
                                : "text-foreground/80"
                            }`}
                            onClick={closeSheet}
                          >
                            {link.name}
                          </Link>
                        ))}

                        <div className="space-y-2">
                          <div
                            className={`text-base font-medium ${isServicePath ? "text-primary font-semibold" : "text-foreground/80"}`}
                          >
                            <Link href="/services" onClick={closeSheet}>
                              Services
                            </Link>
                          </div>
                          <div className="pl-4 space-y-4 border-l border-border/50">
                            {servicesData.categories.map((category) => (
                              <div key={category.id} className="space-y-3">
                                <div
                                  className="flex items-center justify-between cursor-pointer"
                                  onClick={() => toggleCategory(category.id)}
                                >
                                  <div className="text-sm font-medium text-foreground/80 hover:text-primary">
                                    {category.name}
                                  </div>
                                  <ChevronDown
                                    className={`h-4 w-4 text-foreground/60 transition-transform ${
                                      expandedCategory === category.id
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </div>

                                {expandedCategory === category.id && (
                                  <div className="pl-3 space-y-2 mt-2">
                                    {category.services.map((service) => (
                                      <Link
                                        key={service.id}
                                        href={`/services/${category.id}/${service.id}`}
                                        className="text-xs text-foreground/70 hover:text-primary block py-1"
                                        onClick={closeSheet}
                                      >
                                        {service.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {navLinks.slice(2).map((link) => (
                          <Link
                            key={link.path}
                            href={link.path}
                            className={`text-base font-medium transition-colors hover:text-primary ${
                              pathname === link.path ||
                              (link.path === "/blog" && isBlogPath)
                                ? "text-primary font-semibold"
                                : "text-foreground/80"
                            }`}
                            onClick={closeSheet}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </nav>

                      <div className="pt-6 mt-6 border-t">
                        <Button asChild className="w-full">
                          <Link href="/get-demo" onClick={closeSheet}>
                            Get Demo
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SECOND NAVBAR - Sticky */}
      <header className={`sticky top-1 w-full transition-all duration-100 ease-in-out sticky-navbar ${
        (isScrolled && !isSheetOpen) ? 'opacity-100 pointer-events-auto transform translate-y-0 z-[9999]' : 'opacity-0 pointer-events-none transform -translate-y-full z-[9999]'
      }`}>
        <div className="transition-all duration-100 ease-in-out px-4 py-2" style={{overflow: 'visible'}}>
          <div 
            className={`h-16 flex items-center justify-between transition-all duration-100 ease-in-out px-1 sm:px-1 lg:px-1 relative backdrop-blur-md shadow-sm rounded-full max-w-5xl mx-auto border-2 ${
              isIndustriesPage 
                ? 'bg-black/80 dark:bg-black/90' 
                : 'bg-background/95'
            }`}
            style={{ borderColor: '#DF7D13', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', overflow: 'visible' }}
          >
            {/* Logo - LEFT SIDE */}
            <Link href="/" className="flex-shrink-0 ml-0">
              <NeonLogoBorder width={90} height={26} />
            </Link>

            <nav className="hidden lg:flex items-center justify-center space-x-3 lg:space-x-5 flex-1" style={{overflow: 'visible', position: 'relative'}}>
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-xs md:text-sm font-medium transition-colors hover:text-[#DF7D13] ${
                    pathname === link.path ? "font-semibold" : isIndustriesPage ? "text-white/90" : "text-foreground/80"
                  }`}
                  style={pathname === link.path ? {color: '#DF7D13'} : {}}
                >
                  {link.name}
                </Link>
              ))}

              <div
                className="relative"
                style={{overflow: 'visible', position: 'relative'}}
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
                onClick={handleDropdownClick}
              >
                <div className="inline-flex items-center">
                  <Link 
                    href="/services" 
                    className={`inline-flex items-center text-xs md:text-sm font-medium transition-colors hover:text-[#DF7D13] ${
                      isServicePath ? "font-semibold" : isIndustriesPage ? "text-white/90" : "text-foreground/80"
                    }`}
                    style={isServicePath ? {color: '#DF7D13'} : {}}
                  >
                    Services
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                {isServicesOpen && (
                  <div className="absolute left-0 top-full pt-2 dropdown-menu" style={{ position: 'absolute', zIndex: 10000, left: 0, top: '100%', paddingTop: '8px' }}>
                    <div className="w-64 bg-popover rounded-xl border shadow-lg p-2" style={{backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))'}}>
                      <div className="space-y-1 py-1">
                        {servicesData.categories.map((category) => (
                          <div
                            key={category.id}
                            className="relative"
                            onMouseEnter={() => handleCategoryMouseEnter(category.id)}
                            onMouseLeave={handleCategoryMouseLeave}
                          >
                            <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent cursor-pointer">
                              <span>{category.name}</span>
                              <ChevronDown className="ml-auto h-4 w-4 -rotate-90" />
                            </div>

                            {openCategory === category.id && (
                              <div className="absolute top-0 left-full pl-2" style={{ position: 'absolute', zIndex: 10001, top: 0, left: '100%', paddingLeft: '8px' }}>
                                <div className="w-64 bg-popover rounded-xl border shadow-lg p-2" style={{backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))'}}>
                                  <div className="space-y-1 py-1">
                                    {category.services.map((service) => (
                                      <Link
                                        key={service.id}
                                        href={`/services/${category.id}/${service.id}`}
                                        className="block px-3 py-2 text-sm rounded-lg hover:bg-accent"
                                      >
                                        {service.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-xs md:text-sm font-medium transition-colors hover:text-[#DF7D13] ${
                    pathname === link.path || (link.path === "/blog" && isBlogPath) || (link.path === "/industries" && isIndustriesPage)
                      ? "font-semibold" : isIndustriesPage ? "text-white/90" : "text-foreground/80"
                  }`}
                  style={(pathname === link.path || (link.path === "/blog" && isBlogPath) || (link.path === "/industries" && isIndustriesPage)) ? {color: '#DF7D13'} : {}}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
              
            {/* Right side actions */}
            <div className="flex items-center space-x-2 flex-shrink-0 pr-2">
              <motion.div variants={itemVariants} className="flex items-center">
                <Button
                  asChild
                  size="sm"
                  className="gap-1 px-3 py-1.5 text-xs font-medium bg-gradient-hero shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden group btn-3d whitespace-nowrap"
                >
                  <Link href="/get-demo">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-white/30 to-primary/0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000"></span>
                    <span className="relative z-10 flex items-center">
                      Get Demo
                    </span>
                  </Link>
                </Button>
              </motion.div>
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setIsSheetOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}