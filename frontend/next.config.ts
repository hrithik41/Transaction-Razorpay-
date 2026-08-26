import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  allowedDevOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['localhost:3000'],

  // Note: In a real scenario, you'd use process.env.ALLOWED_ORIGINS
  // For this setup, we explicitly allow localhost access.

  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
