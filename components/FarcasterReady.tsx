"use client";

import { useEffect } from "react";

export function FarcasterReady() {
  useEffect(() => {
    import("@farcaster/miniapp-sdk")
      .then(({ default: sdk }) => {
        sdk?.actions?.ready?.().catch(() => {
          // Not in Farcaster context
        });
      })
      .catch(() => {
        // SDK not available
      });
  }, []);
  return null;
}
