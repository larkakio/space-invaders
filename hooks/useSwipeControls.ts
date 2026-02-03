"use client";

import { useEffect, useRef, useCallback } from "react";

interface SwipeHandlers {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onTap: () => void;
  onSwipeUp?: () => void;
}

export function useSwipeControls(handlers: SwipeHandlers, active: boolean) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isSwiping = useRef(false);
  const lastSwipeTime = useRef(0);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!active) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
      isSwiping.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
      if (deltaX > 10 || deltaY > 10) {
        isSwiping.current = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaTime = Date.now() - touchStartTime.current;
      const deltaX =
        (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
      const deltaY =
        (e.changedTouches[0]?.clientY ?? 0) - touchStartY.current;

      if (deltaTime < 200 && !isSwiping.current) {
        handlersRef.current.onTap();
        return;
      }

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        const now = Date.now();
        if (now - lastSwipeTime.current < 50) return;
        lastSwipeTime.current = now;
        if (deltaX > 30) handlersRef.current.onSwipeRight();
        else if (deltaX < -30) handlersRef.current.onSwipeLeft();
      } else if (
        deltaY < -50 &&
        handlersRef.current.onSwipeUp
      ) {
        handlersRef.current.onSwipeUp();
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [active]);
}
