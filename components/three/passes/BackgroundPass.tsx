"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * PASS 1 — BACKGROUND
 * Transparent. The canvas clears to nothing so the page background (CSS) and
 * the faint grid behind it show through — the grid sits at the very back, the
 * star floats in front. The theme's primary color comes from the <body>
 * background (which crossfades on theme change), not from the scene.
 */
export default function BackgroundPass() {
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    scene.background = null;
  }, [scene]);

  return null;
}
