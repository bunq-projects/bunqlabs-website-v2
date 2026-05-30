// Single source of truth for the two themes. The DOM reads colors from CSS
// variables (see app/globals.css), while the 3D scene reads this `palettes`
// map — so the navbar toggle changes both the page chrome AND the canvas.

export type Theme = "light" | "dark";

export interface ScenePalette {
  /** Scene clear/background color. */
  background: string;
  /** Gradient stops for the background pass plane. */
  bgGradient: [string, string];
  /** Linear fog color (usually matches background). */
  fog: string;
  /** Main hero object base color. */
  object: string;
  /** Emissive tint for the main object. */
  emissive: string;
  /** drei <Environment> preset for image-based lighting. */
  envPreset: "city" | "dawn" | "night" | "sunset" | "studio";
  /** Ambient light intensity. */
  ambient: number;
  /** Bloom strength in the foreground (postprocessing) pass. */
  bloom: number;
}

export const palettes: Record<Theme, ScenePalette> = {
  dark: {
    background: "#0a0a0f",
    bgGradient: ["#14141f", "#05050a"],
    fog: "#0a0a0f",
    object: "#6d4aff",
    emissive: "#3a1f8f",
    envPreset: "night",
    ambient: 0.35,
    bloom: 0.7,
  },
  light: {
    background: "#f5f5f7",
    bgGradient: ["#ffffff", "#e7e7ee"],
    fog: "#f5f5f7",
    object: "#5b3df5",
    emissive: "#ffffff",
    envPreset: "dawn",
    ambient: 0.85,
    bloom: 0.25,
  },
};

export const isTheme = (v: unknown): v is Theme =>
  v === "light" || v === "dark";
