"use client";

import { ChevronRight, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-12">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10 text-white/90 text-sm font-medium shadow-2xl shadow-blue-500/10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide">Now Hiring · Join 200+ Innovators</span>
          </div>
          
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              <span className="block mb-4 opacity-90">Build Your Future</span>
              <span className="block text-white">
                With Atorix
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100/60 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
              Where exceptional talent meets groundbreaking innovation. Join us in shaping 
              the future of technology while growing your career in ways you never imagined.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
            <button className="group relative px-10 py-5 bg-white text-slate-900 rounded-2xl font-semibold text-base shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                Explore Positions
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button className="group px-10 py-5 border border-white/20 rounded-2xl text-white font-semibold text-base backdrop-blur-sm hover:bg-white/5 hover:border-white/30 transition-all duration-500">
              <span className="flex items-center gap-3">
                <Play className="w-4 h-4" />
                Watch Story
              </span>
            </button>
          </div>
          
          
        </div>
      </div>
    </section>
  );
}
