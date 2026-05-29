import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BUILD_DATE: new Date().toISOString(),
  },
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
  /* TODO remove */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
