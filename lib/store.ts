"use client";

import { create } from "zustand";
import { isTheme, type Theme } from "./theme";

const STORAGE_KEY = "theme";

/** In-place content overlays opened from the navbar (no route change). */
export type PanelId = "about" | "work";

interface AppState {
  theme: Theme;
  soundOn: boolean;
  contactOpen: boolean;
  panel: PanelId | null;
  /**
   * Set the theme. `persist` writes the choice to localStorage so it sticks
   * and stops following the OS. The initial DOM→store sync passes
   * `persist: false` so auto-detected themes keep following `prefers-color-scheme`.
   */
  setTheme: (theme: Theme, persist?: boolean) => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  openContact: () => void;
  closeContact: () => void;
  openPanel: (id: PanelId) => void;
  closePanel: () => void;
}

/** Reflect the theme onto <html data-theme> so CSS variables update. */
function applyToDom(theme: Theme, persist: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage may be unavailable (private mode) — non-fatal */
    }
  }
}

// Default must be identical on server and first client render to avoid a
// hydration mismatch. Light is the site default; the inline script in
// layout.tsx fixes the *visual* theme before paint (saved choice → OS pref →
// light), and ThemeSync corrects the store right after mount.
export const useAppStore = create<AppState>((set, get) => ({
  theme: "light",
  soundOn: false,
  contactOpen: false,
  panel: null,

  setTheme: (theme, persist = true) => {
    applyToDom(theme, persist);
    set({ theme });
  },

  toggleTheme: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),

  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),

  // Overlays are mutually exclusive — opening one closes the other.
  openContact: () => set({ contactOpen: true, panel: null }),
  closeContact: () => set({ contactOpen: false }),
  openPanel: (id) => set({ panel: id, contactOpen: false }),
  closePanel: () => set({ panel: null }),
}));

export { isTheme, STORAGE_KEY };
