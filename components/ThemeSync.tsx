"use client";

import { useEffect } from "react";
import { useAppStore, isTheme, STORAGE_KEY } from "@/lib/store";

/**
 * Bridges the pre-paint inline script and the React store, and keeps the theme
 * in sync with the OS until the user makes an explicit choice.
 *
 * Renders nothing. Mount it once near the root.
 */
export default function ThemeSync() {
  const setTheme = useAppStore((s) => s.setTheme);

  useEffect(() => {
    // 1. Adopt whatever the inline script already set on <html> (no persist —
    //    it might be an OS-derived value we want to keep following).
    const domTheme = document.documentElement.dataset.theme;
    if (isTheme(domTheme)) setTheme(domTheme, false);

    // 2. Follow OS changes, but only while the user hasn't picked a theme.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEY)) return; // user override wins
      setTheme(e.matches ? "dark" : "light", false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setTheme]);

  return null;
}
