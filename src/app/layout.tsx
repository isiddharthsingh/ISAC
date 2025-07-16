import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISAC - Your Gateway to International Education",
  description: "Connect with experienced mentors, attend live webinars, and join thousands of students achieving their international education dreams.",
  icons: {
    icon: '/logo.ico',
    shortcut: '/isac_logo.png',
    apple: '/isac_logo.png',
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
