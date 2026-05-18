import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow mobile testing via local network IP
  allowedDevOrigins: ["192.168.43.213", "10.33.230.25", "localhost"],
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
