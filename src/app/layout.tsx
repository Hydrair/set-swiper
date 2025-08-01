import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Set Swiper",
  description: "Swipe through Magic cards and build your favorites list",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
