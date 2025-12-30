import React, { useRef, useEffect, useState } from 'react';

const TwistedWireRing = () => {
  const videoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isLaptopView, setIsLaptopView] = useState(false);

  // Check for dark theme and screen size
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkTheme(isDark);
    };

    const checkScreenSize = () => {
      setIsLaptopView(window.innerWidth <= 1024 && window.innerWidth >= 1024);
    };

    checkTheme();
    checkScreenSize();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener(checkTheme);

    // Listen for window resize
    window.addEventListener('resize', checkScreenSize);

    return () => {
      observer.disconnect();
      mediaQuery.removeListener(checkTheme);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Add keyframes for the pulsing animation
  const pulseKeyframes = `
    @keyframes pulse {
      0% {
        transform: translateY(-50%) scale(1);
        opacity: 0.3;
      }
      100% {
        transform: translateY(-50%) scale(1.1);
        opacity: 0.5;
      }
    }
  `;

  return (
    <>
      <style>{pulseKeyframes}</style>
      <section className="relative w-full overflow-x-hidden">
        <div 
          className="relative w-full min-h-[calc(100vh-80px)] md:min-h-[70vh] flex flex-col lg:flex-row items-center justify-center overflow-hidden px-4 md:px-6 lg:px-8"
          style={{
            margin: '0 auto',
            padding: 0,
            fontFamily: 'Arial, sans-serif',
            maxHeight: 'none',
            minHeight: 'auto',
            isolation: 'isolate',
            maxWidth: '100%',
            width: '100%'
          }}
        >
          {/* Background layers matching IndustriesOverview */}
          <div className="absolute inset-0 bg-muted/30 dark:bg-muted/10"></div>
          <div className="absolute inset-0 bg-[url('/grid.png')] opacity-[0.03]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-80"></div>
          
          {/* Container wrapper with max-width and responsive padding */}
          <div className="relative w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8 w-full">
            {/* Enhanced Glowing effect behind video - Dark theme only */}
            <div
              className="hidden dark:block"
              style={{
                position: 'absolute',
                top: '50%',
                right: '8%',
                width: 'min(600px, 45vw)',
                height: 'min(600px, 45vw)',
                transform: 'translateY(-50%)',
                background: 'radial-gradient(circle, rgba(177, 84, 134, 0.4) 0%, rgba(61, 9, 109, 0.3) 30%, rgba(84, 24, 187, 0.2) 60%, rgba(138, 43, 226, 0.1) 80%, transparent 90%)',
                borderRadius: '50%',
                filter: 'blur(20px)',
                zIndex: 0,
                animation: 'pulse 3s ease-in-out infinite alternate',
                willChange: 'transform, opacity'
              }}
            />
            
            {/* Additional outer glow for enhanced effect */}
            <div
              className="hidden dark:block"
              style={{
                position: 'absolute',
                top: '50%',
                right: '5%',
                width: 'min(600px, 45vw)',
                height: 'min(600px, 45vw)',
                transform: 'translateY(-50%)',
                background: 'radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, rgba(75, 0, 130, 0.1) 40%, rgba(25, 25, 112, 0.05) 70%, transparent 90%)',
                borderRadius: '50%',
                filter: 'blur(30px)',
                zIndex: -1,
                animation: 'pulse 4s ease-in-out infinite alternate-reverse',
                willChange: 'transform, opacity'
              }}
            />
            
            {/* Video Background - positioned on the right */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="hidden lg:block dark:lg:hidden"
              style={{
                position: 'absolute',
                top: '50%',
                right: '10%',
                width: window.innerWidth >= 1440 ? '400px' : '280px',
                height: window.innerWidth >= 1440 ? '400px' : '280px',
                transform: window.innerWidth >= 1440 ? 'translateY(-50%) scale(1.0)' : 'translateY(-50%) scale(1.2)',
                transformOrigin: 'center',
                zIndex: 1,
                opacity: 0.85,
                objectFit: 'cover',
                clipPath: window.innerWidth >= 1440 ? 'circle(130px at center)' : 'circle(90px at center)'
              }}
            >
              <source 
                src="https://res.cloudinary.com/dvt1c3v7l/video/upload/v1757321404/6eec83c9955d2bbde372a4cd32fda7da_h6qppf.mp4" 
                type="video/mp4" 
              />
            </video>

            {/* Video Background for Dark Theme */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="hidden dark:lg:block"
              style={{
                position: 'absolute',
                top: '50%',
                right: '15%',
                width: window.innerWidth >= 1024 ? '350px' : '280px',
                height: window.innerWidth >= 1024 ? '350px' : '280px',
                transform: 'translateY(-50%)',
                zIndex: 1,
                opacity: 0.85,
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            >
              <source 
                src="https://res.cloudinary.com/deni4qbla/video/upload/v1757142111/e037db6aa948d11532f5c5df7f226776_1_z9kbnp.mp4" 
                type="video/mp4" 
              />
            </video>
            
            {/* Enhanced circular overlay with glow - Dark theme only */}
            <div
              className="hidden dark:lg:block"
              style={{
                position: 'absolute',
                top: '50%',
                right: '15%',
                width: window.innerWidth >= 1440 ? '350px' : '280px',
                height: window.innerWidth >= 1440 ? '350px' : '280px',
                transform: 'translateY(-50%)',
                background: 'radial-gradient(circle, rgba(26, 10, 46, 0.1) 0%, rgba(22, 33, 62, 0.2) 40%, rgba(15, 15, 35, 0.3) 70%, rgba(0, 0, 0, 0.4) 100%)',
                borderRadius: '50%',
                zIndex: 2,
                boxShadow: '0 0 60px rgba(177, 84, 134, 0.3), 0 0 120px rgba(84, 24, 187, 0.2), inset 0 0 40px rgba(138, 43, 226, 0.1)'
              }}
            />
            
            {/* Desktop Layout - Hero Content */}
            <div className="hidden lg:flex items-center justify-start relative z-10 w-1/2">
              <div className="w-full max-w-[600px] pl-8 xl:pl-16 2xl:pl-24">
                {/* Badge - Centered */}
                <div className="flex justify-start w-full mb-8">
                  <div className="mx-auto">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-primary">Industries We Serve</span>
                    </div>
                  </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight">
                  <span className="text-black dark:text-white">Industry-Specific </span>
                  <span className="text-blue-600 dark:text-blue-400">SAP Solutions</span>
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
                  We deliver tailored SAP solutions for diverse industries, addressing unique 
                  challenges and creating opportunities for innovation and growth.
                </p>

                {/* CTA Button */}
                <button className="inline-flex items-center px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Explore Industries
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden flex flex-col overflow-hidden w-full flex-grow">
              {/* Video Section - Mobile centered at top */}
              <div className="relative flex-shrink-0 h-40 sm:h-48 md:h-56 flex items-center justify-center mt-4 mb-2">
                {/* Glowing effect for mobile dark theme */}
                <div
                  className="hidden dark:block absolute"
                  style={{
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(177, 84, 134, 0.2) 0%, rgba(61, 9, 109, 0.15) 30%, rgba(84, 24, 187, 0.1) 80%, transparent 90%)',
                    borderRadius: '50%',
                    filter: 'blur(12px)',
                    zIndex: -1,
                    animation: 'pulse 3s ease-in-out infinite alternate',
                    willChange: 'transform, opacity'
                  }}
                />
              
                {/* Light Theme Mobile Video */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute block dark:hidden"
                  style={{
                    width: '200px',
                    height: '200px',
                    opacity: 0.85,
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                >
                  <source 
                    src="https://res.cloudinary.com/dvt1c3v7l/video/upload/v1757321404/6eec83c9955d2bbde372a4cd32fda7da_h6qppf.mp4" 
                    type="video/mp4"
                  />
                </video>

                {/* Dark Theme Mobile Video */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute hidden dark:block"
                  style={{
                    width: '200px',
                    height: '200px',
                    opacity: 0.85,
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                >
                  <source 
                    src="https://res.cloudinary.com/deni4qbla/video/upload/v1757142111/e037db6aa948d11532f5c5df7f226776_1_z9kbnp.mp4" 
                    type="video/mp4"
                  />
                </video>
              </div>

              {/* Content Section - Mobile below video */}
              <div className="relative z-10 flex-1 px-4 sm:px-6 py-2 sm:py-4 text-center flex flex-col justify-start">
                {/* Badge */}
                <div className="flex justify-center w-full mb-4 sm:mb-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-primary">Industries We Serve</span>
                  </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
                  <span className="text-black dark:text-white">Industry-Specific </span>
                  <span className="text-blue-600 dark:text-blue-400">SAP Solutions</span>
                </h1>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 md:mb-6 leading-relaxed">
                  We deliver tailored SAP solutions for diverse industries, addressing unique 
                  challenges and creating opportunities for innovation and growth.
                </p>

                {/* CTA Button */}
                <button className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-fit mx-auto">
                  Explore Industries
                  <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TwistedWireRing;