"use client";

import { ArrowRight, Users, Briefcase, Clock } from "lucide-react";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 lg:p-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Join Our Team?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-lg">
                We're always looking for talented individuals who are passionate about making an impact. 
                Explore our open positions or send us your resume for future opportunities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-medium rounded-xl hover:bg-blue-50 transition-all duration-300 group"
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white/10 p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-white mb-6">Why Join Us?</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Collaborative Culture</h4>
                    <p className="text-blue-100 text-sm mt-1">Work with a team that supports and inspires each other.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Career Growth</h4>
                    <p className="text-blue-100 text-sm mt-1">Opportunities for professional development and advancement.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Flexible Work</h4>
                    <p className="text-blue-100 text-sm mt-1">We believe in work-life balance and offer flexible schedules.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-black/10 p-6 text-center">
            <p className="text-sm text-blue-100">
              <span className="font-medium">Don't see a role that fits?</span> We're growing fast and always looking for great talent.
              <Link 
                href="/contact"
                className="ml-1 text-white font-medium hover:underline focus:outline-none"
              >
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
