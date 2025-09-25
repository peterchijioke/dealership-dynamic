import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,

  // Help with hydration issues
  experimental: {
    optimizePackageImports: ["react-instantsearch"],
  },

  // Add long cache lifetimes for immutable/static assets and Next image optimizer
  async headers() {
    return [
      {
        // Cache Next.js static files (immutable) for 1 year
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache Next.js image optimizer results for 1 day (these can change)
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=2592000',
          },
        ],
      },
      {
        // Cache public static files (e.g., /public) for 30 days
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, must-revalidate',
          },
        ],
      },
    ];
  },

  // Reduce hydration mismatches
  reactStrictMode: true,

  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: process.env.NODE_ENV === "development" ? 60 : 31536000,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"], // Keep error and warn logs
          }
        : false,
  },

  // Disable logging in production
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV !== "production",
    },
  },


  scrollRestoration: true
};

export default nextConfig;
