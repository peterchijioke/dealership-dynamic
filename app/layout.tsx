import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageWrapper from "@/components/layouts/PageWrapper";
import MobileDock from "./(routes)/[...slug]/_components/MobileDock";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF9F7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://yourdealership.com"
  ),
  title: {
    template: "%s | Dealership", 
    default: "Dealership - Quality Pre-Owned & New Vehicles",
  },
  description:
    "Find your perfect vehicle at Dealership. Browse our extensive inventory of quality pre-owned and new cars, trucks, and SUVs with competitive pricing and excellent service.",
  keywords: [
    "used cars",
    "new cars",
    "car dealership",
    "auto sales",
    "vehicles for sale",
    "trucks",
    "SUVs",
    "sedans",
  ],
  authors: [{ name: "Dealership" }],
  creator: "Dealership",
  publisher: "Dealership",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://yourdealership.com",
    siteName: "Dealership",
    title: "Dealership - Quality Pre-Owned & New Vehicles",
    description:
      "Find your perfect vehicle at Dealership. Browse our extensive inventory with competitive pricing and excellent service.",
    images: [
      {
        url: "/og-image.jpg", // Add your dealership's OpenGraph image
        width: 1200,
        height: 630,
        alt: "Dealership",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dealership - Quality Pre-Owned & New Vehicles",
    description:
      "Find your perfect vehicle at Dealership. Browse our extensive inventory with competitive pricing and excellent service.",
    images: ["/twitter-image.jpg"], // Add your dealership's Twitter image
    creator: "@yourdealership", // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://yourdealership.com",
  },
  category: "automotive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for performance */}
        {/* <link rel="dns-prefetch" href="//www.googletagmanager.com" /> */}
        {/* <link rel="dns-prefetch" href="//www.google-analytics.com" /> */}

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />

        {/* GTM script – async, doesn’t block rendering */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID}'+dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `,
          }}
        />

        {/* Structured data for organization */}
        <Script
          type="application/ld+json"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              name: "Dealership",
              url:
                process.env.NEXT_PUBLIC_SITE_URL ||
                "https://yourdealership.com",
              logo: `${
                process.env.NEXT_PUBLIC_SITE_URL || "https://yourdealership.com"
              }/logo.png`,
              image: `${
                process.env.NEXT_PUBLIC_SITE_URL || "https://yourdealership.com"
              }/dealership-image.jpg`,
              description:
                "Quality pre-owned and new vehicles with competitive pricing and excellent service.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Main Street", // Replace with your address
                addressLocality: "Your City",
                addressRegion: "Your State",
                postalCode: "12345",
                addressCountry: "US",
              },
              telephone: "+1-555-123-4567", // Replace with your phone
              priceRange: "$$",
              openingHours: ["Mo-Fr 09:00-18:00", "Sa 09:00-17:00"],
              sameAs: [
                "https://www.facebook.com/yourdealership", // Replace with your social media
                "https://www.twitter.com/yourdealership",
                "https://www.instagram.com/yourdealership",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FAF9F7]`}
      >
        {/* GTM noscript fallback for non-JS users */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <PageWrapper sticky>{children}</PageWrapper>
        <MobileDock />
      </body>
    </html>
  );
}
