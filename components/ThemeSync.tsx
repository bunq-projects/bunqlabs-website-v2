"use client";

import { useEffect } from "react";
import { useAppStore, STORAGE_KEY } from "@/lib/store";
import { isBaseName } from "@/lib/theme";

/**
 * Syncs the store's base theme with the saved choice / OS preference after
 * mount, and keeps following the OS until the user picks a base explicitly.
 * The pre-paint script already set the colors; this aligns the store (and the
 * 3D scene, which reads from it). Renders nothing.
 */
export default function ThemeSync() {
  const setBaseTheme = useAppStore((s) => s.setBaseTheme);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }

    if (isBaseName(saved)) {
      setBaseTheme(saved, false); // already persisted — don't re-write
    } else {
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setBaseTheme(dark ? "dark" : "light", false); // OS-derived — don't persist
    }

    // Follow OS changes until the user makes an explicit choice.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return; // user override wins
      } catch {
        /* ignore */
      }
      setBaseTheme(e.matches ? "dark" : "light", false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setBaseTheme]);

  return null;
}
