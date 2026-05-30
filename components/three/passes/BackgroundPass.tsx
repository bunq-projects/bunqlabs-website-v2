"use client";

import { useAppStore } from "@/lib/store";

/**
 * PASS 1 — BACKGROUND
 * Flat solid background: white in light mode, black in dark mode.
 * No fog, gradient, or plane. Add patterns / textures / images here later.
 */
export default function BackgroundPass() {
  const theme = useAppStore((s) => s.theme);
  const background = theme === "dark" ? "#000000" : "#ffffff";

  return <color attach="background" args={[background]} />;
}
