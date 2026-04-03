import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (typeof process.env.VERCEL_PROJECT_PRODUCTION_URL === "string"
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://space-invaders-brown.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(ROOT_URL),
  title: "Space Invaders: Cosmic Defense",
  description:
    "Classic arcade shooter reimagined for Web3. Defend Earth from alien invasion!",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Space Invaders",
  },
  openGraph: {
    title: "Space Invaders: Cosmic Defense",
    description: "Classic arcade shooter reimagined for Web3",
    url: ROOT_URL,
    siteName: "Space Invaders",
    images: [
      {
        url: `${ROOT_URL}/hero-image.png`,
        width: 1200,
        height: 630,
        alt: "Space Invaders Game",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Space Invaders: Cosmic Defense",
    description: "Classic arcade shooter reimagined for Web3",
    images: [`${ROOT_URL}/hero-image.png`],
  },
  other: {
    "base:app_id":
      process.env.NEXT_PUBLIC_BASE_APP_ID ?? "6981adffb352dc0eac026c25",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0E27",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
