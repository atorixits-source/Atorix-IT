"use client";

import { Briefcase, MapPin, DollarSign, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function OpenPositions({ positions }) {
  const [selectedPosition, setSelectedPosition] = useState(null);

  return (
    <section className="py-32 bg-gradient-to-b from-background to-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4 mr-2" />
            Join Our Team
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
            Current
            <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Opportunities
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find your perfect role and join our amazing team of innovators
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {positions.map((position) => {
            // Use a default icon if none is provided
            const Icon = Briefcase;
            return (
              <div key={position.id} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="relative bg-card/90 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedPosition(selectedPosition?.id === position.id ? null : position)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{position.title}</h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>{position.department || 'IT'}</span>
                            <span className="mx-2">•</span>
                            <span>{position.type || 'Full-time'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-6">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          {position.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2 text-purple-500" />
                          {position.experience}
                        </div>
                        {position.salary && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                            {position.salary}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <svg 
                        className={`w-5 h-5 transition-transform duration-300 ${selectedPosition?.id === position.id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {selectedPosition?.id === position.id && (
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <h4 className="font-semibold text-foreground mb-3">Job Description</h4>
                      <p className="text-muted-foreground mb-4">
                        We're looking for a talented {position.title} to join our {position.department} team. 
                        You'll be working on exciting projects that impact millions of users worldwide.
                      </p>
                      <h4 className="font-semibold text-foreground mb-2">Requirements</h4>
                      <ul className="space-y-2 mb-6">
                        {[
                          `Bachelor's degree in Computer Science or related field`,
                          `${position.experience} of professional experience`,
                          'Strong problem-solving skills',
                          'Excellent communication and teamwork abilities',
                          'Passion for learning and staying current with industry trends'
                        ].map((item, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-muted-foreground text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-center py-3 px-6 bg-muted text-muted-foreground rounded-lg">
                        Please contact us for application details
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
