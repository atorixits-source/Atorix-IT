'use client';

import { useEffect, useState, useMemo } from 'react';
import { Menu, Eye, ChevronUp, ChevronDown } from 'lucide-react';

// Function to generate a slug from text
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Function to extract headings from HTML content or DOM
const extractHeadings = (html) => {
  if (typeof window === 'undefined') return [];
  
  try {
    // First try to get headings from the actual DOM (more reliable)
    const articleElement = document.querySelector('article');
    if (articleElement) {
      const headings = articleElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headings.length > 0) {
        return Array.from(headings).map((heading, index) => {
          const text = heading.textContent || '';
          let slug = heading.id;
          if (!slug) {
            slug = generateSlug(text);
            heading.id = slug;
          }
          const level = parseInt(heading.tagName.charAt(1)); // h1 = 1, h2 = 2, etc.
          
          return {
            id: slug,
            text: text.trim(),
            level,
            index: index + 1
          };
        });
      }
    }
    
    // Fallback: parse HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    return Array.from(headings).map((heading, index) => {
      const text = heading.textContent || '';
      const slug = heading.id || generateSlug(text);
      const level = parseInt(heading.tagName.charAt(1)); // h1 = 1, h2 = 2, etc.
      
      return {
        id: slug,
        text: text.trim(),
        level,
        index: index + 1
      };
    });
  } catch (error) {
    console.error('Error extracting headings:', error);
    return [];
  }
};

export default function TableOfContents({ content = '' }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  // Extract headings from content
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Wait for content to be rendered in the DOM
    const extractHeadingsFromDOM = () => {
      const extracted = extractHeadings(content);
      if (extracted.length > 0) {
        setHeadings(extracted);
      } else {
        // Retry after a short delay if headings aren't found yet
        setTimeout(extractHeadingsFromDOM, 200);
      }
    };
    
    // Initial extraction
    extractHeadingsFromDOM();
    
    // Also listen for DOM changes (in case content loads asynchronously)
    const observer = new MutationObserver(() => {
      const extracted = extractHeadings(content);
      if (extracted.length > 0 && extracted.length !== headings.length) {
        setHeadings(extracted);
      }
    });
    
    const articleElement = document.querySelector('article');
    if (articleElement) {
      observer.observe(articleElement, {
        childList: true,
        subtree: true
      });
    }
    
    return () => observer.disconnect();
  }, [content, headings.length]);

  // Track active heading on scroll
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for better UX

      // Find the current active heading
      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveId(headings[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset from top
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveId(id);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#0a0e1a] rounded-xl p-6 border border-[#1a2332] sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#1a2332]">
        <Menu className="text-[#87ceeb]" size={20} />
        <h3 className="text-lg font-bold text-[#87ceeb]">Table of Contents</h3>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-2">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToSection(heading.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
                activeId === heading.id
                  ? 'bg-[#1e3a8a] text-white shadow-md'
                  : 'bg-[#1a2332]/80 text-[#87ceeb] hover:bg-[#2a3441] hover:text-white'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-[#87ceeb] font-semibold text-sm flex-shrink-0 mt-0.5">
                  {heading.index}.
                </span>
                <span className="text-sm leading-relaxed flex-1 text-white">
                  {heading.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#1a2332] text-[#87ceeb] text-sm">
        <Eye size={16} />
        <span>{headings.length} {headings.length === 1 ? 'section' : 'sections'}</span>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(26, 35, 50, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(135, 206, 235, 0.4);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(135, 206, 235, 0.6);
        }
      `}</style>
    </div>
  );
}

