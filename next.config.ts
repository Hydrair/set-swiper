import type { NextConfig } from "next";

// Set when deploying to a sub path, e.g. GitHub Pages project sites (/set-swiper)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static export so the app can be hosted on GitHub Pages
  output: "export",
  basePath,
  images: {
    // Image optimization needs a server, card images come straight from Scryfall
    unoptimized: true,
  },
};

export default nextConfig;
