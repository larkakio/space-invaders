"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { ShareButton } from "./ShareButton";

export function GameOverScreen() {
  const score = useGameStore((s) => s.score);
  const highScore = useGameStore((s) => s.highScore);
  const startGame = useGameStore((s) => s.startGame);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-space/90 backdrop-blur-sm px-4"
    >
      <div className="text-center space-y-6 max-w-sm">
        <motion.h2
          className="text-4xl font-display text-danger-red"
          style={{ textShadow: "0 0 20px #FF0055" }}
        >
          GAME OVER
        </motion.h2>

        <div className="space-y-2">
          <p className="text-neon-cyan text-2xl font-mono">
            Score: {score.toLocaleString()}
          </p>
          {score >= highScore && score > 0 && (
            <p className="text-neon-purple text-sm">New High Score!</p>
          )}
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <motion.button
            onClick={startGame}
            className="px-8 py-4 bg-neon-cyan/20 border-2 border-neon-cyan rounded-lg text-neon-cyan font-display text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ minHeight: 52 }}
          >
            PLAY AGAIN
          </motion.button>

          <ShareButton score={score} />
        </div>
      </div>
    </motion.div>
  );
}
