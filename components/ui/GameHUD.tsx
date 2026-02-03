"use client";

import { useGameStore } from "@/store/gameStore";

export function GameHUD() {
  const { score, lives, wave, pauseGame } = useGameStore();

  return (
    <div className="fixed top-0 left-0 right-0 z-40 p-4 flex justify-between items-start text-star-white font-mono">
      <div className="backdrop-blur-md bg-deep-space/50 px-4 py-2 rounded-lg border border-neon-cyan/30">
        <p className="text-xs text-neon-cyan uppercase tracking-wider">Score</p>
        <p className="text-2xl text-neon-cyan" style={{ textShadow: "0 0 10px #00F0FF" }}>
          {score.toLocaleString()}
        </p>
      </div>
      <div className="backdrop-blur-md bg-deep-space/50 px-4 py-2 rounded-lg border border-neon-purple/30">
        <p className="text-xs text-neon-purple uppercase tracking-wider">Wave</p>
        <p className="text-2xl text-neon-purple">{wave}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="backdrop-blur-md bg-deep-space/50 px-4 py-2 rounded-lg border border-electric-blue/30">
          <p className="text-xs text-electric-blue uppercase tracking-wider">Lives</p>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: lives }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 bg-electric-blue/30 border border-electric-blue rounded"
              />
            ))}
          </div>
        </div>
        <button
          onClick={pauseGame}
          className="backdrop-blur-md bg-deep-space/50 px-3 py-2 rounded-lg border border-neon-purple/30 text-neon-purple font-display text-sm"
          style={{ minWidth: 44, minHeight: 44 }}
          aria-label="Pause"
        >
          II
        </button>
      </div>
    </div>
  );
}
