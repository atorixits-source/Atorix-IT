"use client";

import Image from "next/image";
import { useTheme } from "@/components/ui/theme-provider";

// Client logos data
const clientLogos = [
  { name: "Binstellar", logo: "/images/clients/Binstellar.png" },
  { name: "Brihati", logo: "/images/clients/Brihati.png" },
  { name: "EPN", logo: "/images/clients/EPN.png" },
  { name: "Form6", logo: "/images/clients/Form6.png" },
  { name: "NXI", logo: "/images/clients/NXI.png" },
  { name: "SFMS", logo: "/images/clients/SFMS.png" },
  { name: "VPTechnoLabs", logo: "/images/clients/VPTechnoLabsFinal.png" },
  { name: "WebSeede", logo: "/images/clients/WebSeede.png" },
  { name: "Protergia", logo: "/images/clients/protergia.png" },
  // We duplicate the first few logos to ensure smooth infinite scroll
  { name: "Binstellar", logo: "/images/clients/Binstellar.png" },
  { name: "Brihati", logo: "/images/clients/Brihati.png" },
  { name: "EPN", logo: "/images/clients/EPN.png" },
];

export default function ClientsSection() {
  const { theme } = useTheme();

  return (
    <section className="py-16 border-t border-b border-border/60 bg-muted/30">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Trusted Partners
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Our Clients</h2>
        </div>

        {/* Logo marquee - continuously scrolling */}
        <div className="relative w-full overflow-hidden">
          <div className="w-full py-6 overflow-hidden">
            <div className="animate-marquee inline-flex space-x-16 whitespace-nowrap">
              {clientLogos.map((client, index) => (
                <div key={index} className="flex items-center justify-center px-4">
                  <div className={`flex items-center justify-center h-16 w-32 rounded-md p-3 shadow-sm ${theme === 'dark' ? 'bg-gray-300' : 'bg-white'}`}>
                    <Image
                      src={client.logo}
                      alt={client.name}
                      width={100}
                      height={50}
                      className={`max-h-12 w-auto object-contain filter hover:grayscale-0 transition-all duration-300 ${theme === 'dark' ? 'grayscale-0 brightness-125 contrast-125' : 'grayscale'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client stats */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">100+</p>
            <p className="text-muted-foreground">Happy Clients</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">50+</p>
            <p className="text-muted-foreground">SAP Projects</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">25+</p>
            <p className="text-muted-foreground">Industries Served</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">10+</p>
            <p className="text-muted-foreground">Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
}
