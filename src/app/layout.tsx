import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ISAC - International Student Advocacy Committee | Global Education Platform",
    template: "%s | ISAC - International Student Advocacy Committee"
  },
  description: "Join ISAC, the leading International Student Advocacy Committee helping 25,000+ students worldwide. Connect with mentors, join WhatsApp groups, attend webinars, and achieve your international education dreams.",
  keywords: [
    "ISAC",
    "International Student Advocacy Committee", 
    "international students",
    "study abroad",
    "student mentorship",
    "WhatsApp groups",
    "university guidance",
    "student webinars",
    "international education",
    "study overseas",
    "student community",
    "university applications",
    "student support",
    "global education",
    "education consultancy"
  ],
  authors: [{ name: "ISAC Team" }],
  creator: "International Student Advocacy Committee",
  publisher: "ISAC",
  metadataBase: new URL('https://www.isac-usa.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.isac-usa.org',
    siteName: 'ISAC - International Student Advocacy Committee',
    title: 'ISAC - International Student Advocacy Committee | Global Education Platform',
    description: 'Join ISAC, the leading International Student Advocacy Committee helping 25,000+ students worldwide. Connect with mentors, join WhatsApp groups, attend webinars, and achieve your international education dreams.',
    images: [
      {
        url: '/Isac-logo.png',
        width: 1200,
        height: 630,
        alt: 'ISAC - International Student Advocacy Committee Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISAC - International Student Advocacy Committee | Global Education Platform',
    description: 'Join ISAC, the leading International Student Advocacy Committee helping 25,000+ students worldwide. Connect with mentors and achieve your international education dreams.',
    images: ['/Isac-logo.png'],
    creator: '@ISAC_Global',
    site: '@ISAC_Global',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.ico',
    shortcut: '/Isac-logo.png',
    apple: '/Isac-logo.png',
  },
  manifest: '/manifest.json',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preload local globe assets for faster loading */}
        <link 
          rel="preload" 
          href="/assets/globe/earth-night.jpg" 
          as="image" 
          type="image/jpeg"
        />
        <link 
          rel="preload" 
          href="/assets/globe/earth-topology.png" 
          as="image" 
          type="image/png"
        />
        
        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ISAC - International Student Advocacy Committee",
              "url": "https://www.isac-usa.org",
              "logo": "https://www.isac-usa.org/Isac-logo.png",
              "description": "International Student Advocacy Committee helping students worldwide achieve their international education dreams through mentorship, community support, and resources.",
              "foundingDate": "2020",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Student Support",
                "url": "https://www.isac-usa.org/whatsapp-groups"
              },
              "sameAs": [
                "https://twitter.com/ISAC_Global",
                "https://linkedin.com/company/isac-global",
                "https://instagram.com/isac_global"
              ],
              "areaServed": "Worldwide",
              "serviceType": "Educational Consulting",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "2500"
              }
            })
          }}
        />
        
        {/* Structured Data - Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ISAC - International Student Advocacy Committee",
              "url": "https://www.isac-usa.org",
              "description": "Global platform connecting international students with mentors, resources, and community support for studying abroad.",
              "publisher": {
                "@type": "Organization",
                "name": "ISAC"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.isac-usa.org//search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Navigation />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
