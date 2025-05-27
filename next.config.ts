import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
