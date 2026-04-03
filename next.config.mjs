import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const wagmiConnectorsEsm = path.join(
  __dirname,
  "node_modules/@wagmi/connectors/dist/esm"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/.well-known/farcaster.json",
        destination: "/api/farcaster-manifest",
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@space-wagmi/baseAccount": path.join(wagmiConnectorsEsm, "baseAccount.js"),
      "@space-wagmi/walletConnect": path.join(wagmiConnectorsEsm, "walletConnect.js"),
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false,
    };
    config.externals = config.externals || [];
    config.externals.push("pino-pretty", "lokijs");
    return config;
  },
};

export default nextConfig;
