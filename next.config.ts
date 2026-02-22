import type { NextConfig } from "next";

const backendUrl = process.env.PET_SHOP_BACKEND_URL ?? "http://localhost:8080";

const backendHost = new URL(backendUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    // prefer `remotePatterns` (supports host+port+protocol) so Next can safely
    // optimize images coming from the backend when needed.
    remotePatterns: [
      {
        protocol: "http",
        hostname: backendHost,
        port: "8080",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
      // proxy uploaded assets to the backend so that avatar URLs work
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
