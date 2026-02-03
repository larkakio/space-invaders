"use client";

import { useEffect } from "react";

interface KeyboardHandlers {
  onLeft: () => void;
  onRight: () => void;
  onShoot: () => void;
  onPause?: () => void;
}

export function useKeyboardControls(
  handlers: KeyboardHandlers,
  active: boolean
) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "ArrowLeft":
          e.preventDefault();
          handlers.onLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          handlers.onRight();
          break;
        case "Space":
          e.preventDefault();
          handlers.onShoot();
          break;
        case "KeyP":
        case "Escape":
          e.preventDefault();
          handlers.onPause?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers, active]);
}
