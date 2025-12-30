"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

// Testimonials data
const testimonials = [
  {
    name: "John Anderson",
    position: "CTO, Global Healthcare Inc.",
    company: "Global Healthcare Inc.",
    image: "/images/clients/Brihati.png",
    text: "Atorix IT Solutions transformed our SAP infrastructure with precision and care. Their team's expertise in S/4 HANA implementation was evident throughout the project. We experienced minimal disruption and are now enjoying the benefits of a more efficient, scalable system.",
    rating: 5,
  },
  {
    name: "Sarah Williams",
    position: "IT Director",
    company: "EuroPharma Group",
    image: "/images/clients/Form6.png",
    text: "The migration to S/4 HANA seemed daunting until we partnered with Atorix IT. Their methodical approach and regular communication made the transition smooth. Their post-implementation support has been exceptional - responsive and thorough.",
    rating: 5,
  },
  {
    name: "Robert Chen",
    position: "Operations Manager",
    company: "Pacific Manufacturing",
    image: "/images/clients/NXI.png",
    text: "We needed an SAP partner who understood the nuances of manufacturing processes. Atorix IT not only delivered a tailored implementation but also provided valuable insights that improved our workflows. Their team feels like an extension of our business.",
    rating: 4,
  },
  {
    name: "Amelia Thompson",
    position: "CFO",
    company: "Infinity Retail",
    image: "/images/clients/protergia.png",
    text: "Working with Atorix IT Solutions on our SAP integration project was a revelation. Their consultants took the time to understand our unique business requirements, resulting in a solution that improved our financial reporting efficiency by 40%.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const timeoutRef = useRef(null);

  // Implement autoplay functionality
  useEffect(() => {
    if (autoplay) {
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [current, autoplay]);

  // Handle navigation
  const goToNext = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setAutoplay(false); // Pause autoplay when manually navigating
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setAutoplay(false); // Pause autoplay when manually navigating
  };

  const goToTestimonial = (index) => {
    setCurrent(index);
    setAutoplay(false); // Pause autoplay when manually navigating
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl opacity-50"></div>

      <div className="container-custom relative z-10">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Client Testimonials
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover how Atorix IT Solutions has helped businesses transform their operations
            with our SAP implementation and support services.
          </p>
        </div>

        {/* Testimonials carousel */}
        <div className="relative max-w-5xl mx-auto px-4">
          {/* Large quote symbol in background */}
          <div className="absolute top-0 left-4 text-primary/10">
            <Quote className="h-24 w-24" />
          </div>

          {/* Current testimonial */}
          <div className="relative dark:bg-background/50 dark:hover:bg-background/60 rounded-xl p-8 md:p-10 shadow-lg border border-border/40">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Company logo and person info */}
              <div className="md:w-1/4 flex flex-col items-center md:items-start">
                <div className="w-24 h-24 p-2 rounded-lg bg-primary/5 mb-4 flex items-center justify-center">
                  <Image
                    src={testimonials[current].image}
                    alt={testimonials[current].company}
                    width={80}
                    height={80}
                    className="object-contain max-h-full"
                  />
                </div>
                <h4 className="font-semibold text-lg">{testimonials[current].name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{testimonials[current].position}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonials[current].rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Testimonial text */}
              <div className="md:w-3/4">
                <p className="text-lg italic text-foreground">{testimonials[current].text}</p>
              </div>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex justify-between items-center mt-8">
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === current ? "bg-primary" : "bg-primary/20"
                  }`}
                />
              ))}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrev}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
