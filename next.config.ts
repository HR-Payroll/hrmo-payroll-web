import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  // turbopack: {
  //   // ...
  // },
  compiler: {
    styledComponents: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // or '100mb'
    },
  },
};

export default nextConfig;
