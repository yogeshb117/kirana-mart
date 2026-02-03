import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Shubh Lakshmi Kirana Mart - Fresh Groceries Delivered',
  description: 'Order fresh groceries, staples, and daily essentials from Shubh Lakshmi Kirana Mart. Fast delivery to your doorstep in New Delhi and Gurgaon.',
  keywords: ['grocery', 'kirana', 'delivery', 'online shopping', 'fresh vegetables', 'daily essentials', 'Shubh Lakshmi'],
  metadataBase: new URL('https://shubhlakshmikirana.com'),
  openGraph: {
    title: 'Shubh Lakshmi Kirana Mart - Fresh Groceries Delivered',
    description: 'Order fresh groceries, staples, and daily essentials from Shubh Lakshmi Kirana Mart.',
    url: 'https://shubhlakshmikirana.com',
    siteName: 'Shubh Lakshmi Kirana Mart',
    images: [
      {
        url: '/logo-cartoon.png',
        width: 800,
        height: 600,
        alt: 'Shubh Lakshmi Kirana Mart Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shubh Lakshmi Kirana Mart',
    description: 'Fresh groceries delivered to your door.',
    images: ['/logo-cartoon.png'],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  "name": "Shubh Lakshmi Kirana Mart",
  "image": "https://shubhlakshmikirana.com/logo-cartoon.png",
  "@id": "https://shubhlakshmikirana.com",
  "url": "https://shubhlakshmikirana.com",
  "telephone": "+919876543210",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Main Market",
    "addressLocality": "New Delhi",
    "postalCode": "110001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "08:00",
    "closes": "22:00"
  },
  "sameAs": [
    "https://facebook.com/shubhlakshmikirana",
    "https://instagram.com/shubhlakshmikirana"
  ]
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#047857", // Emerald 700
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <Providers>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

