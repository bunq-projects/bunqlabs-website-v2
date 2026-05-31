"use client";

import { create } from "zustand";
import { THEMES, type ThemeColors, type BaseName } from "./theme";
import { PROJECTS, PROJECT_COUNT } from "./projects";

const STORAGE_KEY = "theme"; // persists the base name: "light" | "dark"
const CROSSFADE_MS = 400;

/** In-place content overlays opened from the navbar (no route change). */
export type PanelId = "about";

/** Top-level content the page shows in place (no route change — SPA). */
export type ViewId = "home" | "work";

interface AppState {
  // ── Theme ────────────────────────────────────────────────────────────────
  /** The site default (light/dark) — persisted, OS-aware. Restored on reload. */
  base: ThemeColors;
  baseName: BaseName;
  /** What's actually displayed right now (= base, or a project's theme). */
  active: ThemeColors;
  /** Label for the active theme (for the dev switcher / debugging). */
  activeName: string;

  /** Set the base theme (light/dark). Persisted unless persist=false. */
  setBaseTheme: (name: BaseName, persist?: boolean) => void;
  /** Toggle base light↔dark (navbar). */
  toggleBaseTheme: () => void;
  /** Apply an arbitrary theme transiently — e.g. when a project opens. */
  setProjectTheme: (colors: ThemeColors, name?: string) => void;
  /** Revert the active theme back to the base — e.g. when a project closes. */
  resetTheme: () => void;

  // ── Views (home ↔ work) ───────────────────────────────────────────────────
  /** Which top-level content is showing in place of the hero. */
  view: ViewId;
  /** Index of the active project in the Work view. */
  workIndex: number;
  /** Open the Work view and apply the active project's theme. */
  enterWork: () => void;
  /** Return to the home/hero view and restore the base theme. */
  goHome: () => void;
  /** Jump to a specific project (clamped) and apply its theme. */
  setProject: (index: number) => void;
  /** Next / previous project (clamped to the ends). */
  nextProject: () => void;
  prevProject: () => void;

  // ── UI ───────────────────────────────────────────────────────────────────
  soundOn: boolean;
  contactOpen: boolean;
  panel: PanelId | null;
  toggleSound: () => void;
  openContact: () => void;
  closeContact: () => void;
  openPanel: (id: PanelId) => void;
  closePanel: () => void;
}

let crossfadeTimer: number | undefined;

/**
 * Apply a theme by writing exactly TWO custom properties on <html>. Every other
 * token derives from these via color-mix (style-guide.css), so the browser only
 * recomputes from one source — the performant path. A short-lived
 * `theme-transitioning` class enables a scoped color crossfade for the swap.
 */
function applyToDom(colors: ThemeColors) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (!reduce) {
    root.classList.add("theme-transitioning");
    window.clearTimeout(crossfadeTimer);
    crossfadeTimer = window.setTimeout(
      () => root.classList.remove("theme-transitioning"),
      CROSSFADE_MS,
    );
  }

  root.style.setProperty("--primary", colors.primary);
  root.style.setProperty("--secondary", colors.secondary);
}

export const useAppStore = create<AppState>((set, get) => ({
  // Defaults match the pre-paint inline script + SSR (light), so no flash /
  // hydration mismatch. ThemeSync corrects to the saved/OS base after mount.
  base: THEMES.light,
  baseName: "light",
  active: THEMES.light,
  activeName: "light",

  setBaseTheme: (name, persist = true) => {
    const colors = THEMES[name];
    applyToDom(colors);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, name);
      } catch {
        /* storage may be unavailable (private mode) — non-fatal */
      }
    }
    set({ base: colors, baseName: name, active: colors, activeName: name });
  },

  toggleBaseTheme: () =>
    get().setBaseTheme(get().baseName === "dark" ? "light" : "dark"),

  setProjectTheme: (colors, name = "custom") => {
    applyToDom(colors);
    set({ active: colors, activeName: name });
  },

  resetTheme: () => {
    const { base, baseName } = get();
    applyToDom(base);
    set({ active: base, activeName: baseName });
  },

  // ── Views ──────────────────────────────────────────────────────────────
  // Opening Work applies the active project's 2-color theme to the WHOLE site
  // (a crossfade via setProjectTheme); navigating projects re-themes; returning
  // home restores the base theme. Per-project colors live in lib/projects.ts.
  view: "home",
  workIndex: 0,

  enterWork: () => {
    const p = PROJECTS[get().workIndex];
    if (p) get().setProjectTheme(p.theme, p.name);
    set({ view: "work", panel: null, contactOpen: false });
  },

  goHome: () => {
    get().resetTheme();
    set({ view: "home" });
  },

  setProject: (index) => {
    const i = Math.max(0, Math.min(PROJECT_COUNT - 1, index));
    const p = PROJECTS[i];
    if (p && get().view === "work") get().setProjectTheme(p.theme, p.name);
    set({ workIndex: i });
  },

  nextProject: () => get().setProject(get().workIndex + 1),
  prevProject: () => get().setProject(get().workIndex - 1),

  soundOn: false,
  contactOpen: false,
  panel: null,

  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),

  // Overlays are mutually exclusive — opening one closes the other.
  openContact: () => set({ contactOpen: true, panel: null }),
  closeContact: () => set({ contactOpen: false }),
  openPanel: (id) => set({ panel: id, contactOpen: false }),
  closePanel: () => set({ panel: null }),
}));

export { STORAGE_KEY };
