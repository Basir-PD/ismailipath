import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  poweredByHeader: false,
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
  // Add shorter ISR revalidation time for all pages
  staticPageGenerationTimeout: 300,
  // Set up data fetch caching options
  staleTimes: {
    // Shorter stale times for faster revalidation
    static: 60, // Only stay fresh for 1 minute
    revalidate: 10, // Revalidate at most every 10 seconds
  },
  // Redirect blog URLs to home page and individual blog posts to article routes
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/article/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
