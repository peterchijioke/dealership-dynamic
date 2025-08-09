import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */


   images: {
    remotePatterns: [
    {
      protocol: 'http',
      hostname: 'vehicle-photos-published.vauto.com',
      port: '',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'vehicle-photos-published.vauto.com',
      port: '',
      pathname: '/**',
    },
  ],
  },
};

export default nextConfig;
