const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://space-invaders-brown.vercel.app");

/**
 * MiniApp configuration for Space Invaders: Cosmic Defense
 * Base App & Farcaster integration
 */
export const farcasterConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjI2MzY1MjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHg5MkNEMDcyNjdENzcwNkE1OTE4RmQ3MzJFQWUwNzJDOGE1QjIzNmMzIn0",
    payload: "eyJkb21haW4iOiJzcGFjZS1pbnZhZGVycy1icm93bi52ZXJjZWwuYXBwIn0",
    signature: "lEiETA8d8o4IOHZWtt2J0Bm99IjWAoKTPSfn4EFoVPsZj9FjGkvWPMGEAEsUyH8WH2yoMeRWRwTdNcz9kGY0BBs=",
  },
  miniapp: {
    version: "1",
    name: "Space Invaders: Cosmic Defense",
    subtitle: "Classic arcade shooter",
    description:
      "Defend Earth from waves of alien invaders in this Web3-powered arcade classic. Compete globally and climb the leaderboard!",
    screenshotUrls: [
      `${ROOT_URL}/screenshot-1.png`,
      `${ROOT_URL}/screenshot-2.png`,
      `${ROOT_URL}/screenshot-3.png`,
    ],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/hero-image.png`,
    splashBackgroundColor: "#0A0E27",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["arcade", "shooter", "retro", "web3", "space-invaders"],
    heroImageUrl: `${ROOT_URL}/hero-image.png`,
    tagline: "Defend Earth. Climb the ranks.",
    ogTitle: "Space Invaders: Cosmic Defense",
    ogDescription:
      "Classic arcade shooter reimagined for Web3. Play now on Farcaster!",
    ogImageUrl: `${ROOT_URL}/hero-image.png`,
  },
} as const;
