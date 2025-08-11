import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cards.scryfall.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/card-image/**',
      },
      {
        protocol: 'https',
        hostname: 'set-swiper.vercel.app',
        port: '',
        pathname: '/api/card-image/**',
      },
    ],
  },
};

export default nextConfig;
