"use client";

import { useGameStore } from "@/store/gameStore";
import { StartScreen } from "@/components/ui/StartScreen";
import { GameCanvas } from "@/components/game/GameCanvas";
import { GameHUD } from "@/components/ui/GameHUD";
import { GameOverScreen } from "@/components/ui/GameOverScreen";
import { PauseMenu } from "@/components/ui/PauseMenu";

export default function Home() {
  const gameStatus = useGameStore((s) => s.gameStatus);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-deep-space to-cosmic-purple">
      {gameStatus === "menu" && <StartScreen />}
      {gameStatus === "playing" && (
        <>
          <GameHUD />
          <GameCanvas />
        </>
      )}
      {gameStatus === "paused" && (
        <>
          <GameHUD />
          <GameCanvas />
          <PauseMenu />
        </>
      )}
      {gameStatus === "gameOver" && (
        <>
          <GameCanvas />
          <GameOverScreen />
        </>
      )}
    </main>
  );
}
