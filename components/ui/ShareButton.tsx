"use client";

import { motion } from "framer-motion";

interface ShareButtonProps {
  score: number;
}

export function ShareButton({ score }: ShareButtonProps) {
  const handleShare = async () => {
    const text = `I scored ${score.toLocaleString()} points in Space Invaders: Cosmic Defense! 🚀 Defend Earth and beat my score!`;
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Space Invaders: Cosmic Defense",
          text,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await navigator.clipboard?.writeText(`${text} ${url}`);
        }
      }
    } else {
      await navigator.clipboard?.writeText(`${text} ${url}`);
    }
  };

  return (
    <motion.button
      onClick={handleShare}
      className="px-8 py-4 bg-neon-purple/20 border-2 border-neon-purple rounded-lg text-neon-purple font-display text-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ minHeight: 52 }}
    >
      Share Score
    </motion.button>
  );
}
