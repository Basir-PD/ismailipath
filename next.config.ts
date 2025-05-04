import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  // Optimize image loading
  images: {
    domains: ["prod-files-secure.s3.us-west-2.amazonaws.com", "s3.us-west-2.amazonaws.com"],
    formats: ["image/avif", "image/webp"],
  },
  // Improved navigation experience
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};

export default nextConfig;
