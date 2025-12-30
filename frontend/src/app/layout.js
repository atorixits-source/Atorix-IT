"use client";

import { Inter } from "next/font/google";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingContactButtons from "@/components/common/FloatingContactButtons";
import PopupContactForm from "@/components/common/PopupContactForm";
import { AuthProvider } from "@/context/AuthContext";
import { pingBackend } from "@/lib/api";
import "@/utils/api/apiInterceptor";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  useEffect(() => {
    pingBackend();
  }, []);

  // Helper component to suppress hydration warnings for dynamic content
  const SafeHtml = ({ children }) => {
    return <div suppressHydrationWarning={true}>{children}</div>;
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Google Analytics gtag.js */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XGPZ7T4SW0"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XGPZ7T4SW0');
            `,
          }}
        />

        {/* GTM Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KWJLJVXW');`,
          }}
        />

        {/* Updated SEO Meta Tags */}
        <title>Atorix IT Solutions: SAP Implementation Partner & SAP Consulting Services</title>
        <meta name="description" content="Atorix IT Solutions is a top SAP Implementation Partner. We offer SAP Services, SuccessFactors, SAP S/4HANA Cloud Solutions etc." />
        <link rel="canonical" href="https://www.atorixit.com/" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Atorix IT Solutions - SAP Partner, Enterprise Solutions, Process Automation, Digital Transformation" />
        <meta property="og:description" content="A leading SAP Services Partner, Licensing Partner, provides Niche Technology (S4 HANA, SuccessFactors, Ariba, Analytics Cloud, Cloud for Customer) Solutions and Services in India, Malaysia, Qatar, and USA. SAP Solution Partner with 10+ years of dedicated focus on SAP Solutions delivery." />
        <meta property="og:url" content="https://www.atorixit.com/" />
        <meta property="og:site_name" content="Atorix IT Solutions" />
        <meta property="article:modified_time" content="2025-05-18 T06:48:47+00:00" />
        <meta property="og:image" content="https://www.atorixit.com/AtorixIT.png" />
        <meta property="og:image:width" content="150" />
        <meta property="og:image:height" content="40" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Atorix IT Solutions - SAP Partner, Enterprise Solutions, Process Automation, Digital Transformation" />
        <meta name="twitter:description" content="A leading SAP Services Partner, Licensing Partner, provides Niche Technology (S4 HANA, SuccessFactors, Ariba, Analytics Cloud, Cloud for Customer) Solutions and Services in India, Malaysia, Qatar, and USA. SAP Solution Partner with 12+ years of dedicated focus on SAP Solutions delivery." />

        {/* Structured Data Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
            {
              "@context":"https://schema.org",
              "@graph":[
                {
                  "@type":"WebPage",
                  "@id":"https://www.atorixit.com/",
                  "url":"https://www.atorixit.com/",
                  "name":"Atorix IT Solutions : SAP Implementation Partner & SAP Consulting Services",
                  "isPartOf":{"@id":"https://www.atorixit.com/#website"},
                  "about":{"@id":"https://www.atorixit.com/#organization"},
                  "primaryImageOfPage":{"@id":"https://www.atorixit.com/#primaryimage"},
                  "image":{"@id":"https://www.atorixit.com/#primaryimage"},
                  "thumbnailUrl":"https://www.atorixit.com/AtorixIT.png",
                  "datePublished":"2025-05-18T06:19:30+00:00",
                  "dateModified":"2025-05-19T06:48:47+00:00",
                  "description":"Atorix IT Solutions is a top SAP Implementation Partner. We offer SAP Services, SuccessFactors, SAP S/4HANA Cloud Solutions etc.",
                  "breadcrumb":{"@id":"https://www.atorixit.com/#breadcrumb"},
                  "inLanguage":"en-US",
                  "potentialAction":[{"@type":"ReadAction","target":["https://www.atorixit.com/"]}]
                },
                {
                  "@type":"ImageObject",
                  "inLanguage":"en-US",
                  "@id":"https://www.atorixit.com/#primaryimage",
                  "url":"https://www.atorixit.com/AtorixIT.png",
                  "contentUrl":"https://www.atorixit.com/AtorixIT.png",
                  "width":150,
                  "height":40,
                  "caption":"Atorixit-logo"
                },
                {
                  "@type":"BreadcrumbList",
                  "@id":"https://www.atorixit.com/#breadcrumb",
                  "itemListElement":[{"@type":"ListItem","position":1,"name":"Home"}]
                },
                {
                  "@type":"WebSite",
                  "@id":"https://www.atorixit.com/#website",
                  "url":"https://www.atorixit.com/",
                  "name":"Atorix IT Solutions",
                  "description":"Innovating Excellence",
                  "publisher":{"@id":"https://www.atorixit.com/#organization"},
                  "potentialAction":[{"@type":"SearchAction","target":{"@type":"EntryPoint","urlTemplate":"https://www.atorixit.com/?s={search_term_string}"},"query-input":"required name=search_term_string"}],
                  "inLanguage":"en-US"
                },
                {
                  "@type":"Organization",
                  "@id":"https://www.atorixit.com/#organization",
                  "name":"Atorix IT Solutions",
                  "url":"https://www.atorixit.com/",
                  "logo":{
                    "@type":"ImageObject",
                    "inLanguage":"en-US",
                    "@id":"https://www.atorixit.com/#/schema/logo/image/",
                    "url":"https://www.atorixit.com/AtorixIT.png",
                    "contentUrl":"https://www.atorixit.com/AtorixIT.png",
                    "width":150,
                    "height":40,
                    "caption":"Atorix IT Solutions"
                  },
                  "image":{"@id":"https://www.atorixit.com/#/schema/logo/image/"}
                }
              ]
            }
            `
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* GTM NoScript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KWJLJVXW"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <SafeHtml>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <FloatingContactButtons />
              <PopupContactForm />
            </SafeHtml>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
