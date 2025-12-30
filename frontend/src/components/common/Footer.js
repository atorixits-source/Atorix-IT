"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { NeonLogoBorder } from "./Navbar";

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* MOTI TOP DIVIDER LINE - YE NAYA HAI */}
      <div className={`border-t-4 ${isDark ? 'border-gray-700' : 'border-gray-300'}`} />
      
      <footer className={`relative py-16 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} overflow-hidden`}>
        {/* RESPONSIVE ROTATING CIRCLES - AB MOBILE PE CHHOTA HOGA */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[650px] md:h-[650px] lg:w-[800px] lg:h-[800px] animate-spin-slow">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderImage: isDark 
                    ? "linear-gradient(45deg, #8b5cf6, #3b82f6, #8b5cf6) 1"
                    : "linear-gradient(45deg, #a78bfa, #60a5fa, #a78bfa) 1",
                  transform: `scale(${0.5 + i * 0.15})`,
                  opacity: isDark ? (0.8 - i * 0.05) : (0.6 - i * 0.04),
                  boxShadow: isDark 
                    ? `0 0 ${25 + i * 15}px rgba(139, 92, 246, ${0.7 - i * 0.05}), 
                       inset 0 0 ${25 + i * 15}px rgba(59, 130, 246, ${0.5 - i * 0.03})`
                    : `0 0 ${25 + i * 15}px rgba(167, 139, 250, ${0.5 - i * 0.04}), 
                       inset 0 0 ${25 + i * 15}px rgba(96, 165, 250, ${0.4 - i * 0.03})`,
                }}
              />
            ))}
          </div>
        </div>

        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-b from-black via-transparent to-black' 
            : 'bg-gradient-to-b from-white via-transparent to-white'
          } pointer-events-none`} 
        />
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-radial from-purple-900/20 via-transparent to-transparent'
            : 'bg-gradient-radial from-purple-200/30 via-transparent to-transparent'
          } pointer-events-none`} 
        />

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <div className="mb-6">
                <Link href="/" className="flex items-center">
                  <NeonLogoBorder width={100} height={28} />
                </Link>
              </div>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm leading-relaxed mb-6`}>
                Atorix IT Solutions is the Best SAP S4 HANA Implementation Partner
                in India with its head office in Pune. We provide robust, business
                process solutions for successful clients.
              </p>
              <div className="flex space-x-4">
                <Link href="https://facebook.com" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`} target="_blank" rel="noopener noreferrer">
                  <Facebook size={20} />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="https://twitter.com" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`} target="_blank" rel="noopener noreferrer">
                  <Twitter size={20} />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="https://linkedin.com" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`} target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link href="https://instagram.com" className={`${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'} transition-colors`} target="_blank" rel="noopener noreferrer">
                  <Instagram size={20} />
                  <span className="sr-only">Instagram</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Home</Link></li>
                <li><Link href="/about" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>About Us</Link></li>
                <li><Link href="/services" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Services</Link></li>
                <li><Link href="/industries" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Industries</Link></li>
                <li><Link href="/blog" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Blog</Link></li>
                <li><Link href="/contact" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Contact</Link></li>
                <li><Link href="/career" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Careers</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Services</h3>
              <ul className="space-y-3">
                <li><Link href="/services/sap-application/implementation-rollout" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>SAP S/4 Implementation</Link></li>
                <li><Link href="/services/sap-application/sap-ecc-s4-hana-support" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>SAP S/4 Support</Link></li>
                <li><Link href="/services/sap-application/sap-integration" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>SAP S/4 Integration</Link></li>
                <li><Link href="/services/sap-application/upgrade-services" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>SAP S/4 Upgrade</Link></li>
                <li><Link href="/services/sap-application/sap-s4-hana-migration" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>SAP S/4 Migration</Link></li>
                <li><Link href="/services/sap-application/sap-business-one-implementation" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>SAP Business One</Link></li>
                <li><Link href="/services/data-science" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Data Science</Link></li>
                <li><Link href="/services/data-science/machine-learning" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Machine Learning</Link></li>
                <li><Link href="/services/data-science/data-analytics" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Data Analytics</Link></li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className={`mr-3 h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'} flex-shrink-0 mt-1`} />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>3rd Floor, Office No. C 305 DP Road, Police, Wireless Colony, Pune, Maharashtra.</span>
                </li>
                <li className="flex items-center">
                  <Phone className={`mr-3 h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'} flex-shrink-0`} />
                  <a href="tel:+918956001555" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>+91 89560 01555</a>
                </li>
                <li className="flex items-center">
                  <Mail className={`mr-3 h-5 w-5 ${isDark ? 'text-purple-400' : 'text-purple-600'} flex-shrink-0`} />
                  <a href="mailto:info@atorix.in" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>info@atorix.in</a>
                </li>
              </ul>
            </div>
          </div>

          <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-300'} mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>© {new Date().getFullYear()} Atorix IT Solutions. All rights reserved.</p>
            <div className="flex mt-4 sm:mt-0">
              <Link href="/privacy" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Privacy Policy</Link>
              <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'} mx-2`}>|</span>
              <Link href="/terms" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Terms of Service</Link>
              <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'} mx-2`}>|</span>
              <Link href="/blog" className={`text-sm ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Blog</Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
        `}</style>
      </footer>
    </>
  );
}
