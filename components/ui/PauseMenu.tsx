"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

export function PauseMenu() {
  const resumeGame = useGameStore((s) => s.resumeGame);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-space/80 backdrop-blur-sm"
    >
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-display text-neon-purple">PAUSED</h2>
        <motion.button
          onClick={resumeGame}
          className="px-12 py-4 bg-neon-cyan/20 border-2 border-neon-cyan rounded-lg text-neon-cyan font-display text-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ minHeight: 52 }}
        >
          RESUME
        </motion.button>
      </div>
    </motion.div>
  );
}
