"use client";

import { useEffect, useRef } from "react";

// Atlas: /cursors/cursors_atlas.webp — 216×144, a 3×2 grid (72px cells), in
// row-major order. Index = col + row*3.
type CursorType =
  | "arrow"
  | "pointing-hand"
  | "open-hand"
  | "closed-hand"
  | "i-beam"
  | "move";

const INDEX: Record<CursorType, number> = {
  arrow: 0,
  "pointing-hand": 1,
  "open-hand": 2,
  "closed-hand": 3,
  "i-beam": 4,
  move: 5,
};

const COLS = 3;
const CELL = 40; // on-screen cell px — must match background-size (120×80) in CSS

// One selector → one DOM traversal per element crossing.
const HIT =
  '[data-cursor], a, button, [role="button"], label, input, textarea, [contenteditable="true"], canvas';

const isCursorType = (v: string | undefined): v is CursorType =>
  !!v && v in INDEX;

/**
 * Custom cursor — insanely cheap:
 * - Position: ONE `transform` write per pointermove; the CSS transition eases
 *   it on the compositor (no requestAnimationFrame loop, zero idle cost).
 * - Sprite: resolved on `pointerover` only (fires when crossing into a new
 *   element), via a single combined `closest()`, repainted only on change.
 * Disabled on touch / coarse pointers; native cursor fully hidden when active.
 */
export default function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;

    document.documentElement.classList.add("custom-cursor");

    let base: CursorType = "arrow"; // resolved from the element
    let shown: CursorType = "arrow"; // currently painted sprite
    let down = false;
    let visible = false;

    const paint = () => {
      const next: CursorType = base === "open-hand" && down ? "closed-hand" : base;
      if (next === shown) return;
      shown = next;
      const i = INDEX[next];
      el.style.backgroundPosition = `${-(i % COLS) * CELL}px ${
        -Math.floor(i / COLS) * CELL
      }px`;
    };

    const resolve = (target: EventTarget | null): CursorType => {
      const m =
        target instanceof Element ? target.closest<HTMLElement>(HIT) : null;
      if (!m) return "arrow";
      if (isCursorType(m.dataset.cursor)) return m.dataset.cursor;
      const tag = m.tagName;
      if (tag === "CANVAS") return "open-hand";
      if (tag === "INPUT" || tag === "TEXTAREA" || m.isContentEditable) {
        return "i-beam";
      }
      return "pointing-hand"; // a / button / role=button / label
    };

    // Movement: a single transform write, glued 1:1 to the pointer (no easing).
    const onMove = (e: PointerEvent) => {
      if (!visible) {
        el.style.opacity = "1";
        visible = true;
      }
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    // Sprite: only when the pointer enters a different element.
    const onOver = (e: PointerEvent) => {
      base = resolve(e.target);
      paint();
    };
    const onDown = () => {
      down = true;
      paint();
    };
    const onUp = () => {
      down = false;
      paint();
    };
    const onLeave = () => {
      el.style.opacity = "0";
      visible = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
