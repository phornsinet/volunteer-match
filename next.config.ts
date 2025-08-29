import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ykdmmfpoccfeveuclknh.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
