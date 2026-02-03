import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { FarcasterReady } from "@/components/FarcasterReady";
import "./globals.css";

const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (typeof process.env.VERCEL_PROJECT_PRODUCTION_URL === "string"
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://space-invaders-brown.vercel.app");

const FC_EMBED = {
  version: "1" as const,
  imageUrl: `${ROOT_URL}/hero-image.png`,
  button: {
    title: "Play Space Invaders",
    action: {
      type: "launch_frame" as const,
      name: "Space Invaders: Cosmic Defense",
      url: ROOT_URL,
      splashImageUrl: `${ROOT_URL}/hero-image.png`,
      splashBackgroundColor: "#0A0E27",
    },
  },
};

export const metadata: Metadata = {
  title: "Space Invaders: Cosmic Defense",
  description:
    "Classic arcade shooter reimagined for Web3. Defend Earth from alien invasion!",
  viewport:
    "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
  themeColor: "#0A0E27",
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
    "fc:miniapp": JSON.stringify(FC_EMBED),
    "fc:frame": JSON.stringify(FC_EMBED),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <FarcasterReady />
          {children}
        </Providers>
      </body>
    </html>
  );
}
