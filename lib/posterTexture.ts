// Procedural poster textures for project tiles. Until real artwork is dropped in
// /public/work, each tile is drawn on a <canvas> from the project's theme colors
// (a gradient + an accent arc + the wordmark), so the 3D slider looks intentional
// with zero external assets. Corners are drawn with a transparent radius so the
// tiles read as rounded cards. Swap `project.poster` to load a real image instead.

import {
  CanvasTexture,
  SRGBColorSpace,
  LinearFilter,
  type Texture,
} from "three";
import type { Project } from "./projects";

const W = 512;
const H = 620; // ~0.83 aspect, close to the design's tile ratio

/** Shade a #rrggbb hex toward black (amt<0) or white (amt>0). */
function shade(hex: string, amt: number): string {
  const n = hex.replace("#", "");
  const full =
    n.length === 3
      ? n
          .split("")
          .map((c) => c + c)
          .join("")
      : n;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const mix = (c: number) =>
    Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
  const to2 = (c: number) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0");
  return `#${to2(mix(r))}${to2(mix(g))}${to2(mix(b))}`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Build a themed placeholder texture for a project. Cheap (one canvas paint),
 * cached by the caller. Marked sRGB so colors are accurate under MeshBasicMaterial.
 */
export function makePosterTexture(project: Project): Texture {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  const { primary, secondary } = project.theme;

  // Tiles are SECONDARY-dominant with PRIMARY accents — the inverse of the page
  // (which becomes the project's primary). This guarantees each tile pops against
  // its themed page, and matches the design (e.g. Ember's gold card on purple).

  // Rounded clip → corners stay transparent (alpha) so tiles look like cards.
  roundRect(ctx, 0, 0, W, H, 26);
  ctx.clip();

  // Background gradient in the project's secondary.
  const grad = ctx.createLinearGradient(0, 0, W * 0.4, H);
  grad.addColorStop(0, shade(secondary, 0.1));
  grad.addColorStop(1, shade(secondary, -0.2));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Large soft accent arc in the primary (the "brand mark" gesture).
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = primary;
  ctx.beginPath();
  ctx.arc(W * 0.72, H * 0.34, W * 0.46, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // A subtle disc to add depth over the arc.
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = shade(secondary, -0.45);
  ctx.beginPath();
  ctx.arc(W * 0.5, H * 0.46, W * 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Wordmark, bottom-left, in the primary.
  ctx.fillStyle = primary;
  ctx.font = "600 46px ui-sans-serif, system-ui, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(project.name, 36, H - 96);

  // First tag, small caps, beneath the wordmark.
  ctx.globalAlpha = 0.72;
  ctx.fillStyle = primary;
  ctx.font = "500 20px ui-monospace, monospace";
  ctx.fillText((project.tags[0] ?? "").toUpperCase(), 38, H - 60);
  ctx.globalAlpha = 1;

  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}
