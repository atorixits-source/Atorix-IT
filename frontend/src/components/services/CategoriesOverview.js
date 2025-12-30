"use client";

import Link from "next/link";
import servicesData from "@/data/services.json";

export default function CategoriesOverview() {
  return (
    <section className="py-16 relative">
      {/* Subtle background pattern for categories section */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 01. Consulting Services */}
          <div>
            <h2 className="text-3xl font-bold text-[#6b3eb0] mb-6">
              01. Consulting Services
            </h2>
            <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
              {servicesData.categories
                .find((cat) => cat.id === "consulting")
                ?.services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/consulting/${service.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* 02. SAP ERP Technologies */}
          <div>
            <h2 className="text-3xl font-bold text-[#6b3eb0] mb-6">
              02. SAP ERP Technologies
            </h2>
            <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
              {servicesData.categories
                .find((cat) => cat.id === "erp-tech")
                ?.services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/erp-tech/${service.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* 03. SAP Application Services */}
          <div>
            <h2 className="text-3xl font-bold text-[#6b3eb0] mb-6">
              03. SAP Application Services
            </h2>
            <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
              {servicesData.categories
                .find((cat) => cat.id === "sap-application")
                ?.services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/sap-application/${service.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* 04. Microsoft Dynamics */}
          <div>
            <h2 className="text-3xl font-bold text-[#6b3eb0] mb-6">
              04. Microsoft Dynamics
            </h2>
            <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
              {servicesData.categories
                .find((cat) => cat.id === "microsoft-dynamics")
                ?.services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/microsoft-dynamics/${service.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* 05. Security Services */}
          <div>
            <h2 className="text-3xl font-bold text-[#6b3eb0] mb-6">
              05. Security Services
            </h2>
            <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
              {servicesData.categories
                .find((cat) => cat.id === "security")
                ?.services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/services/security/${service.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
