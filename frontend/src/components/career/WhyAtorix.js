"use client";

import { Globe, TrendingUp, Users, Target, CheckCircle } from "lucide-react";

export default function WhyAtorix() {
  const features = [
    {
      title: "Global Impact",
      description: "Work on projects that reach millions of users worldwide. Your code will power solutions used across 15+ countries.",
      icon: Globe,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Rapid Growth",
      description: "Join a company growing 40% year-over-year. We offer clear career paths and promotion opportunities based on merit.",
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      title: "Expert Team",
      description: "Collaborate with industry experts and thought leaders. Learn from the best in the field through mentorship programs.",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    {
      title: "Meaningful Work",
      description: "Build products that solve real problems. See your work make a tangible difference in people's lives.",
      icon: Target,
      color: "text-orange-600",
      bg: "bg-orange-100"
    }
  ];

  const stats = [
    { value: "500K+", label: "Users Served" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "15+", label: "Countries" },
    { value: "40%", label: "Annual Growth" }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">Why Atorix Stands Out</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover what makes Atorix the perfect place to build your career
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">By the Numbers</h3>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-bold mb-2">{stat.value}</p>
                  <p className="text-blue-100">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-white/10 rounded-xl">
              <p className="text-lg font-medium">
                "Joining Atorix was the best career decision I made. The growth opportunities and amazing team culture are unmatched."
              </p>
              <p className="text-sm text-blue-100 mt-2">- Sarah Chen, Senior Developer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
