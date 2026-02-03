import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-cyan": "#00F0FF",
        "neon-magenta": "#FF00FF",
        "neon-purple": "#9D00FF",
        "electric-blue": "#0080FF",
        "deep-space": "#0A0E27",
        "cosmic-purple": "#1A0B2E",
        "star-white": "#FFFFFF",
        "danger-red": "#FF0055",
      },
      fontFamily: {
        display: ["var(--font-orbitron)"],
        body: ["var(--font-rajdhani)"],
        mono: ["var(--font-share-tech-mono)"],
      },
      boxShadow: {
        "glow-cyan": "0 0 20px #00F0FF, 0 0 40px #00F0FF",
        "glow-magenta": "0 0 20px #FF00FF, 0 0 40px #FF00FF",
        "glow-purple": "0 0 20px #9D00FF, 0 0 40px #9D00FF",
      },
    },
  },
  plugins: [],
};

export default config;
