import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for the production Docker image (copies only the runtime server).
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "**.example.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "**.irpsc.com",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
