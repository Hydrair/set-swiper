import type { Metadata } from "next";
import "./globals.css";
import { CONFIG } from "@/lib/config";

const basePath = CONFIG.BASE_PATH;

export const metadata: Metadata = {
  title: "Set Swiper",
  description: "Swipe through Magic cards and build your favorites list",
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Set Swiper",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: `${basePath}/icons/icon-192x192.png`, sizes: "192x192", type: "image/png" },
      { url: `${basePath}/icons/icon-512x512.png`, sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: `${basePath}/icons/icon-192x192.png`, sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href={`${basePath}/manifest.json`} />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Set Swiper" />
        <link rel="apple-touch-icon" href={`${basePath}/icons/icon-192x192.png`} />
      </head>
      <body>
        {children}
        <script src={`${basePath}/pwa-register.js`} async />
      </body>
    </html>
  );
}
