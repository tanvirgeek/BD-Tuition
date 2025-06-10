import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    domains: [
      "res.cloudinary.com",
    ]
  }
};

export default nextConfig;
