import { create } from "zustand";
import {
  CANVAS_WIDTH,
  PLAYER_WIDTH,
  PLAYER_Y,
  PLAYER_SPEED,
  INITIAL_LIVES,
  ALIEN_COLS,
  ALIEN_ROWS,
  ALIEN_WIDTH,
  ALIEN_HEIGHT,
  ALIEN_GAP,
  ALIEN_POINTS,
} from "@/lib/constants";

export interface Alien {
  id: string;
  x: number;
  y: number;
  row: number;
  col: number;
  points: number;
  alive: boolean;
}

export interface Bullet {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  isPlayer: boolean;
}

export interface Shield {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number[][];
}

interface GameState {
  gameStatus: "menu" | "playing" | "paused" | "gameOver";
  score: number;
  lives: number;
  wave: number;
  highScore: number;

  player: {
    x: number;
    y: number;
    speed: number;
    invincibleUntil?: number;
  };

  aliens: Alien[];
  bullets: Bullet[];
  alienBullets: Bullet[];
  shields: Shield[];
  alienDirection: number;
  alienDropAmount: number;

  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  movePlayer: (direction: "left" | "right") => void;
  shoot: () => void;
  spawnWave: () => void;
  addBullet: (bullet: Bullet) => void;
  removeBullet: (id: string) => void;
  killAlien: (id: string) => void;
  addAlienBullet: (bullet: Bullet) => void;
  updateScore: (points: number) => void;
  loseLife: () => void;
  setAliens: (aliens: Alien[]) => void;
  setAlienDirection: (dir: number) => void;
  setAlienDropAmount: (amount: number) => void;
  damageShield: (shieldId: string, localX: number, localY: number) => void;
}

function createAlien(row: number, col: number, wave: number): Alien {
  const startX = 40 + col * (ALIEN_WIDTH + ALIEN_GAP);
  const startY = 80 + row * (ALIEN_HEIGHT + ALIEN_GAP);
  const points = ALIEN_POINTS[row] * wave;
  return {
    id: `alien-${row}-${col}`,
    x: startX,
    y: startY,
    row,
    col,
    points,
    alive: true,
  };
}

function createShields(): Shield[] {
  const shields: Shield[] = [];
  const shieldW = 70;
  const gap = 20;
  const totalWidth = 4 * shieldW + 3 * gap;
  const startX = Math.max(0, (CANVAS_WIDTH - totalWidth) / 2);
  const shieldY = 420;

  for (let i = 0; i < 4; i++) {
    const grid: number[][] = [];
    for (let gy = 0; gy < 5; gy++) {
      grid[gy] = [];
      for (let gx = 0; gx < 10; gx++) {
        grid[gy][gx] = 1;
      }
    }
    shields.push({
      id: `shield-${i}`,
      x: startX + i * (shieldW + gap),
      y: shieldY,
      width: shieldW,
      height: 40,
      health: grid,
    });
  }
  return shields;
}

export const useGameStore = create<GameState>((set, get) => ({
  gameStatus: "menu",
  score: 0,
  lives: INITIAL_LIVES,
  wave: 1,
  highScore: 0,

  player: {
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: PLAYER_Y,
    speed: PLAYER_SPEED,
  },

  aliens: [],
  bullets: [],
  alienBullets: [],
  shields: [],
  alienDirection: 1,
  alienDropAmount: 0,

  startGame: () => {
    const highScore = get().highScore;
    set({
      gameStatus: "playing",
      score: 0,
      lives: INITIAL_LIVES,
      wave: 1,
      aliens: [],
      bullets: [],
      alienBullets: [],
      alienDirection: 1,
      alienDropAmount: 0,
      player: {
        x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
        y: PLAYER_Y,
        speed: PLAYER_SPEED,
        invincibleUntil: 0,
      },
    });
    get().spawnWave();
  },

  pauseGame: () => set({ gameStatus: "paused" }),
  resumeGame: () => set({ gameStatus: "playing" }),

  gameOver: () => {
    const { score, highScore } = get();
    set({
      gameStatus: "gameOver",
      highScore: Math.max(score, highScore),
    });
  },

  movePlayer: (direction) => {
    const { player } = get();
    const newX =
      direction === "left"
        ? Math.max(0, player.x - player.speed)
        : Math.min(CANVAS_WIDTH - PLAYER_WIDTH, player.x + player.speed);
    set({
      player: { ...player, x: newX },
    });
  },

  shoot: () => {
    const { player, bullets, gameStatus } = get();
    if (gameStatus !== "playing") return;
    const bullet: Bullet = {
      id: `bullet-${Date.now()}`,
      x: player.x + PLAYER_WIDTH / 2 - 2,
      y: player.y,
      width: 4,
      height: 12,
      speed: -8,
      isPlayer: true,
    };
    set({ bullets: [...bullets, bullet] });
  },

  spawnWave: () => {
    const { wave } = get();
    const aliens: Alien[] = [];
    for (let row = 0; row < ALIEN_ROWS; row++) {
      for (let col = 0; col < ALIEN_COLS; col++) {
        aliens.push(createAlien(row, col, wave));
      }
    }
    set({
      aliens,
      shields: createShields(),
      bullets: [],
      alienBullets: [],
    });
  },

  addBullet: (bullet) =>
    set((s) => ({ bullets: [...s.bullets, bullet] })),

  removeBullet: (id) =>
    set((s) => ({
      bullets: s.bullets.filter((b) => b.id !== id),
      alienBullets: s.alienBullets.filter((b) => b.id !== id),
    })),

  killAlien: (id) =>
    set((s) => ({
      aliens: s.aliens.map((a) =>
        a.id === id ? { ...a, alive: false } : a
      ),
    })),

  addAlienBullet: (bullet) =>
    set((s) => ({ alienBullets: [...s.alienBullets, bullet] })),

  updateScore: (points) =>
    set((s) => {
      const newScore = s.score + points;
      return {
        score: newScore,
        highScore: Math.max(newScore, s.highScore),
      };
    }),

  loseLife: () =>
    set((s) => {
      const newLives = s.lives - 1;
      const invincibleUntil = Date.now() + 1800; // 1.8s invincibility after hit
      if (newLives <= 0) {
        get().gameOver();
        return { lives: 0 };
      }
      return {
        lives: newLives,
        bullets: [],
        alienBullets: [],
        player: {
          ...s.player,
          x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
          invincibleUntil,
        },
      };
    }),

  setAliens: (aliens) => set({ aliens }),
  setAlienDirection: (dir) => set({ alienDirection: dir }),
  setAlienDropAmount: (amount) => set({ alienDropAmount: amount }),

  damageShield: (shieldId, localX, localY) => {
    set((s) => ({
      shields: s.shields.map((sh) => {
        if (sh.id !== shieldId) return sh;
        const grid = sh.health.map((row) => [...row]);
        const gx = Math.floor((localX / sh.width) * 10);
        const gy = Math.floor((localY / sh.height) * 5);
        if (gx >= 0 && gx < 10 && gy >= 0 && gy < 5) {
          grid[gy][gx] = 0;
        }
        return { ...sh, health: grid };
      }),
    }));
  },
}));
