import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images: {
    remotePatterns: [new URL('https://images.pexels.com/**'), new URL('https://www.pexels.com/**')],
  },};

export default nextConfig;
