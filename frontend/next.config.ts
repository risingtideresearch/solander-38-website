import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BUILD_DATE: new Date().toISOString(),
  },
  devIndicators: false,
  async redirects() {
    return [
      // /photos was renamed to /photography
      { source: "/photos", destination: "/photography", permanent: true },
      { source: "/photos/:path*", destination: "/photography/:path*", permanent: true },
    ];
  },
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
    // capture-stills.mjs versions these with ?v=<hash> to bust the image cache;
    // everything else keeps the default of no query string
    localPatterns: [
      { pathname: "/homepage/**" },
      { pathname: "/thumbs/**" },
      { pathname: "/**", search: "" },
    ],
  },
};

export default nextConfig;
