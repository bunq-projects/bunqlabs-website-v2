// A theme is just two colors. Everything else — page chrome (via color-mix in
// style-guide.css) and the 3D scene (via the store) — is derived from them.
// This makes themes cheap to swap: change 2 values, the whole site adapts.

export interface ThemeColors {
  /** Dominant / background color. */
  primary: string;
  /** Contrast / text color. */
  secondary: string;
}

/** Built-in named themes. Projects will add their own at runtime. */
export const THEMES = {
  light: { primary: "#ffffff", secondary: "#000000" },
  dark: { primary: "#000000", secondary: "#ffffff" },
  ember: { primary: "#6a0dad", secondary: "#ffd700" },
} satisfies Record<string, ThemeColors>;

/** Names of the two base themes the navbar toggle / OS preference switch between. */
export type BaseName = "light" | "dark";

export const DEFAULT_BASE: BaseName = "light";

export const isBaseName = (v: unknown): v is BaseName =>
  v === "light" || v === "dark";
