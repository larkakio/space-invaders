"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const highScore = useGameStore((s) => s.highScore);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-cosmic-purple to-deep-space px-4"
    >
      <div className="text-center space-y-8 max-w-md">
        <motion.h1
          className="text-5xl sm:text-6xl font-display text-neon-cyan"
          style={{ textShadow: "0 0 20px #00F0FF, 0 0 40px #00F0FF" }}
          animate={{
            textShadow: [
              "0 0 20px #00F0FF, 0 0 40px #00F0FF",
              "0 0 30px #00F0FF, 0 0 60px #00F0FF",
              "0 0 20px #00F0FF, 0 0 40px #00F0FF",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SPACE
          <br />
          INVADERS
        </motion.h1>

        <p className="text-xl text-star-white/70 font-body">Cosmic Defense</p>

        {highScore > 0 && (
          <div className="text-neon-purple">
            <p className="text-sm uppercase tracking-wider">High Score</p>
            <p className="text-3xl font-mono">{highScore.toLocaleString()}</p>
          </div>
        )}

        <motion.button
          onClick={startGame}
          className="px-12 py-4 bg-neon-cyan/10 border-2 border-neon-cyan rounded-lg text-neon-cyan font-display text-xl backdrop-blur-sm hover:bg-neon-cyan/20 transition-colors"
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px #00F0FF" }}
          whileTap={{ scale: 0.95 }}
          style={{ minWidth: 160, minHeight: 52 }}
        >
          PLAY NOW
        </motion.button>

        <p className="text-sm text-star-white/50 font-body">
          Swipe or arrows to move • Tap or Space to shoot
        </p>
      </div>
    </motion.div>
  );
}
