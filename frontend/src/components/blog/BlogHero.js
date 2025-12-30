import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import AnimatedBlobBackground from "./AnimatedBlobBackground";
import { Search } from "lucide-react";

export default function BlogHero({ onSearch, initialSearch = '' }) {
  const searchInputRef = useRef(null);
  const title = "Our Blog";
  const description = "Stay updated with the latest insights, news, and updates from our team.";
  
  const searchTerms = [
    "SAP S/4 HANA",
    "ECC 6.0",
    "Implementation and Rollout",
    "Advanced Data Analytics",
    "Microsoft Dynamics 365",
    "Cyber Security Services"
  ];
  
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [displayText, setDisplayText] = useState(searchTerms[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Update search query when initialSearch changes
  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);
  
  useEffect(() => {
    const currentTerm = searchTerms[currentPlaceholder];
    
    const typeEffect = () => {
      if (isDeleting) {
        // Deleting characters
        setDisplayText(prev => prev.slice(0, -1));
        
        if (displayText === '') {
          setIsDeleting(false);
          setCurrentPlaceholder((prev) => (prev + 1) % searchTerms.length);
        }
      } else {
        // Adding characters
        const targetText = searchTerms[currentPlaceholder];
        if (displayText.length < targetText.length) {
          setDisplayText(targetText.slice(0, displayText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 1500);
          return;
        }
      }
    };
    
    const timeout = setTimeout(typeEffect, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPlaceholder, searchTerms]);
  
  // Cursor blinking effect - only when search is not focused
  useEffect(() => {
    if (isSearchFocused) {
      setShowCursor(false);
      return;
    }
    
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, [isSearchFocused]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery.trim());
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200 py-20 md:py-32">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <AnimatedBlobBackground />
      </div>
      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            {title}
          </h1>
          <div className="relative max-w-2xl mx-auto mb-8">
            <p className="text-lg text-muted-foreground relative z-20">
              {description}
            </p>
          </div>
          {/* Split lines with increased gap at the center and moved further apart */}
          {/* Left half - moved further left */}
          <div className="pointer-events-none absolute top-[55%] left-5 w-[40%] h-1 bg-gradient-to-r from-transparent via-blue-500/45 to-transparent blur-[2px] transform -translate-y-1/2 z-0"></div>
          <div className="pointer-events-none absolute top-[55%] left-5 w-[40%] h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent transform -translate-y-1/2 z-0"></div>
          
          {/* Right half - moved further right */}
          <div className="pointer-events-none absolute top-[55%] right-5 w-[40%] h-1 bg-gradient-to-l from-transparent via-blue-500/45 to-transparent blur-[2px] transform -translate-y-1/2 z-0"></div>
          <div className="pointer-events-none absolute top-[55%] right-5 w-[40%] h-0.5 bg-gradient-to-l from-transparent via-blue-300 to-transparent transform -translate-y-1/2 z-0"></div>
          
          {/* Search Bar */}
          <motion.div 
            className="max-w-md mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={isSearchFocused || searchQuery ? "Search blog posts..." : `Search for ${displayText}${showCursor ? '|' : ''}...`}
                className={`w-full max-w-2xl px-6 py-4 pl-12 pr-16 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                isSearchFocused ? 'shadow-lg' : 'shadow-md hover:shadow-lg'
              }`}/>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1 rounded-full transition-colors duration-200"
                onClick={handleSearch}
              >
                Search
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
