import type { NextConfig } from "next";

const apiUrl = process.env.API_URL ?? "http://localhost:3001";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg"],
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path((?!auth(?:/|$)).*)",
        destination: `${apiUrl}/api/:path`,
      },
    ];
  },
};

export default nextConfig;
