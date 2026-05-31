"use client";

import { useAppStore } from "@/lib/store";
import { THEMES } from "@/lib/theme";

/**
 * TEMPORARY dev control — three buttons (bottom-right) to trigger themes.
 *
 * light / dark set the site base theme; "ember" simulates a project theme
 * (transient). In future this whole component is removed: themes will be
 * triggered by project open/close via `setProjectTheme` / `resetTheme`.
 */
export default function ThemeSwitcher() {
  const activeName = useAppStore((s) => s.activeName);
  const setBaseTheme = useAppStore((s) => s.setBaseTheme);
  const setProjectTheme = useAppStore((s) => s.setProjectTheme);

  return (
    <div className="theme-switcher" aria-label="Theme switcher (temporary)">
      <button
        className={activeName === "light" ? "is-active" : ""}
        onClick={() => setBaseTheme("light")}
      >
        Light
      </button>
      <button
        className={activeName === "dark" ? "is-active" : ""}
        onClick={() => setBaseTheme("dark")}
      >
        Dark
      </button>
      <button
        className={activeName === "ember" ? "is-active" : ""}
        onClick={() => setProjectTheme(THEMES.ember, "ember")}
      >
        Ember
      </button>
    </div>
  );
}
