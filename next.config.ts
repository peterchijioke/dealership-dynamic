import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
trailingSlash:true,

   images: {
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
     dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
     minimumCacheTTL: process.env.NODE_ENV === 'development' ? 60 : 31536000,
    
    remotePatterns: [
    {
      protocol: 'http',
      hostname: '*',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: '*',
      port: '',
      pathname: '/**',
    },
  ],
  },




   compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? {
          exclude: ['error', 'warn'] // Keep error and warn logs
        }
      : false,
  },
  
  // Disable logging in production
  logging: {
    
    fetches: {
      fullUrl: process.env.NODE_ENV !== 'production',
    },
  },
  
  
};

export default nextConfig;
