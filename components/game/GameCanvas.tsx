"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGameStore } from "@/store/gameStore";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useSwipeControls } from "@/hooks/useSwipeControls";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { checkCollision } from "@/lib/utils";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  ALIEN_WIDTH,
  ALIEN_HEIGHT,
  ALIEN_GAP,
  BULLET_WIDTH,
  BULLET_HEIGHT,
} from "@/lib/constants";

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStatus = useGameStore((s) => s.gameStatus);
  const isPlaying = gameStatus === "playing" || gameStatus === "paused";

  const movePlayer = useGameStore((s) => s.movePlayer);
  const shoot = useGameStore((s) => s.shoot);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const spawnWave = useGameStore((s) => s.spawnWave);
  const {
    player,
    aliens,
    bullets,
    alienBullets,
    shields,
    alienDirection,
    alienDropAmount,
    setAliens,
    setAlienDirection,
    setAlienDropAmount,
    removeBullet,
    killAlien,
    updateScore,
    loseLife,
    addAlienBullet,
    damageShield,
    gameOver,
  } = useGameStore();

  const lastAlienBulletTime = useRef(0);
  const alienMoveAccum = useRef(0);

  const updateGame = useCallback((deltaTime: number) => {
    const state = useGameStore.getState();
    if (state.gameStatus !== "playing") return;

    const dt = deltaTime / 16.67;
    const { aliens: currentAliens, wave } = useGameStore.getState();
    const speedFactor = Math.min(0.14 + (wave - 1) * 0.035, 0.45);

    alienMoveAccum.current += dt * speedFactor;
    if (alienMoveAccum.current >= 1) {
      alienMoveAccum.current = 0;
      const aliveAliens = currentAliens.filter((a) => a.alive);
        if (aliveAliens.length === 0) {
          const wave = useGameStore.getState().wave;
          useGameStore.setState({ wave: wave + 1 });
          useGameStore.getState().spawnWave();
          return;
        }

        let minX = Infinity;
        let maxX = -Infinity;
        aliveAliens.forEach((a) => {
          minX = Math.min(minX, a.x);
          maxX = Math.max(maxX, a.x + ALIEN_WIDTH);
        });

        const moveAmount = 2.5 + Math.min(wave - 1, 5) * 0.65;
        let newDir = useGameStore.getState().alienDirection;
        let drop = 0;

        if (newDir > 0 && maxX + moveAmount > CANVAS_WIDTH - 20) {
          newDir = -1;
          drop = 5 + Math.min(wave - 1, 5) * 1.4;
        } else if (newDir < 0 && minX - moveAmount < 20) {
          newDir = 1;
          drop = 5 + Math.min(wave - 1, 5) * 1.4;
        }

        useGameStore.getState().setAlienDirection(newDir);
        useGameStore.getState().setAlienDropAmount(drop);

        const updated = aliveAliens.map((a) => ({
          ...a,
          x: a.x + moveAmount * newDir,
          y: a.y + drop,
        }));

        const maxY = Math.max(...updated.map((a) => a.y + ALIEN_HEIGHT));
        if (maxY >= 520) {
          useGameStore.getState().gameOver();
          return;
        }

        useGameStore.getState().setAliens(updated);

        const now = Date.now();
        const bulletInterval = Math.max(1350 - wave * 65, 820);
        if (now - lastAlienBulletTime.current > bulletInterval) {
          lastAlienBulletTime.current = now;
          const bottomAliens = updated.filter((a) => {
            const sameCol = updated.some(
              (o) => o.col === a.col && o.row > a.row
            );
            return !sameCol;
          });
          const pick = bottomAliens[Math.floor(Math.random() * bottomAliens.length)];
          if (pick) {
            useGameStore.getState().addAlienBullet({
              id: `ab-${now}`,
              x: pick.x + ALIEN_WIDTH / 2 - 2,
              y: pick.y + ALIEN_HEIGHT,
              width: 4,
              height: 10,
              speed: 4,
              isPlayer: false,
            });
          }
        }
      }

    const { player: p, bullets: blts, alienBullets: ablts, shields: shds } = useGameStore.getState();
    const playerRect = {
      x: p.x,
      y: p.y,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
    };

    blts.forEach((b) => {
        b.y += b.speed;
        if (b.y < -20) {
          useGameStore.getState().removeBullet(b.id);
          return;
        }

        const { aliens: aliensForCollision } = useGameStore.getState();
        let hit = false;
        for (const a of aliensForCollision) {
          if (!a.alive) continue;
          const alienRect = { x: a.x, y: a.y, width: ALIEN_WIDTH, height: ALIEN_HEIGHT };
          const bulletRect = { x: b.x, y: b.y, width: b.width, height: b.height };
          if (checkCollision(bulletRect, alienRect)) {
            useGameStore.getState().killAlien(a.id);
            useGameStore.getState().updateScore(a.points);
            useGameStore.getState().removeBullet(b.id);
            hit = true;
            break;
          }
        }
        if (hit) return;

        shds.forEach((sh) => {
          const bulletRect = { x: b.x, y: b.y, width: b.width, height: b.height };
          const shRect = { x: sh.x, y: sh.y, width: sh.width, height: sh.height };
          if (checkCollision(bulletRect, shRect)) {
            const localX = b.x - sh.x;
            const localY = b.y - sh.y;
            useGameStore.getState().damageShield(sh.id, localX, localY);
            useGameStore.getState().removeBullet(b.id);
          }
        });
      });

    const now = Date.now();
    const invincible = (p.invincibleUntil ?? 0) > now;
    let playerHitThisFrame = false;

    for (const b of ablts) {
        b.y += b.speed;
        if (b.y > CANVAS_HEIGHT + 20) {
          useGameStore.getState().removeBullet(b.id);
          continue;
        }

        const bulletRect = { x: b.x, y: b.y, width: b.width, height: b.height };
        if (!invincible && !playerHitThisFrame && checkCollision(bulletRect, playerRect)) {
          useGameStore.getState().loseLife();
          useGameStore.getState().removeBullet(b.id);
          playerHitThisFrame = true;
          continue;
        }

        shds.forEach((sh) => {
          const shRect = { x: sh.x, y: sh.y, width: sh.width, height: sh.height };
          if (checkCollision(bulletRect, shRect)) {
            const localX = b.x - sh.x;
            const localY = b.y - sh.y;
            useGameStore.getState().damageShield(sh.id, localX, localY);
            useGameStore.getState().removeBullet(b.id);
          }
        });
      }
    },
    [] // Stable: all state via getState(), no store deps to avoid loop restarts
  );

  useGameLoop(updateGame, isPlaying);

  useSwipeControls(
    {
      onSwipeLeft: () => movePlayer("left"),
      onSwipeRight: () => movePlayer("right"),
      onTap: () => shoot(),
      onSwipeUp: () => shoot(),
    },
    isPlaying
  );

  useKeyboardControls(
    {
      onLeft: () => movePlayer("left"),
      onRight: () => movePlayer("right"),
      onShoot: () => shoot(),
      onPause: () => pauseGame(),
    },
    isPlaying
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const { player: p, aliens: a, bullets: bl, alienBullets: ab, shields: sh } =
        useGameStore.getState();

      ctx.fillStyle = "#0A0E27";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = "#1a1a2e";
      for (let i = 0; i < 60; i++) {
        const x = (i * 137) % CANVAS_WIDTH;
        const y = ((i * 97) % CANVAS_HEIGHT) + (Date.now() / 50) % CANVAS_HEIGHT;
        ctx.fillRect(x, y % CANVAS_HEIGHT, 2, 2);
      }

      sh.forEach((shield) => {
        const cellW = shield.width / 10;
        const cellH = shield.height / 5;
        shield.health.forEach((row, gy) => {
          row.forEach((cell, gx) => {
            if (cell > 0) {
              ctx.fillStyle = "#00F0FF";
              ctx.fillRect(shield.x + gx * cellW, shield.y + gy * cellH, cellW + 1, cellH + 1);
              ctx.strokeStyle = "#00F0FF";
              ctx.globalAlpha = 0.8;
              ctx.strokeRect(shield.x + gx * cellW, shield.y + gy * cellH, cellW, cellH);
              ctx.globalAlpha = 1;
            }
          });
        });
      });

      a.forEach((alien) => {
        if (!alien.alive) return;
        ctx.fillStyle = alien.row < 2 ? "#FF00FF" : alien.row < 4 ? "#9D00FF" : "#0080FF";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fillRect(alien.x, alien.y, ALIEN_WIDTH, ALIEN_HEIGHT);
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(alien.x, alien.y, ALIEN_WIDTH, ALIEN_HEIGHT);
      });

      bl.forEach((b) => {
        ctx.fillStyle = "#00F0FF";
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      ab.forEach((b) => {
        ctx.fillStyle = "#FF0055";
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      const invincible = (p.invincibleUntil ?? 0) > Date.now();
      ctx.globalAlpha = invincible ? 0.4 + 0.3 * Math.sin(Date.now() / 80) : 1;
      ctx.fillStyle = "#00F0FF";
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(p.x + PLAYER_WIDTH / 2, p.y);
      ctx.lineTo(p.x, p.y + PLAYER_HEIGHT);
      ctx.lineTo(p.x + PLAYER_WIDTH, p.y + PLAYER_HEIGHT);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    };

    const id = requestAnimationFrame(function loop() {
      draw();
      requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="flex justify-center items-center p-4 pt-24">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-neon-cyan/30 rounded-lg max-w-full"
        style={{ maxHeight: "calc(100vh - 120px)" }}
        onClick={() => gameStatus === "playing" && shoot()}
      />
    </div>
  );
}
