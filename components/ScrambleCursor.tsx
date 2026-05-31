"use client";

import { useEffect, useRef } from "react";

// Characters cycled through while scrambling.
const SCRAMBLE_CHARS = "XYZxy#&@0$€£";

/**
 * A pill that follows the pointer and scrambles its label to the hovered
 * element's text. Mark any element with `data-cursor-hover` + `data-cursor-text`
 * to activate it:
 *
 *   <a data-cursor-hover data-cursor-text="Open project">…</a>
 *
 * GSAP + ScrambleTextPlugin are loaded on the client only (code-split). Gated
 * to fine pointers (no touch). Coexists with the sprite CustomCursor.
 */
export default function ScrambleCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const textTarget = textRef.current;
    if (!cursor || !textTarget) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const [{ default: gsap }, { ScrambleTextPlugin }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrambleTextPlugin"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrambleTextPlugin);

      // Smoothly trail the pointer (gsap-managed, compositor transform).
      const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3.out" });

      let active: Element | null = null;

      // active / active-edge (flip left near the right edge) / "" (hidden).
      const setState = () => {
        if (!active) {
          cursor.setAttribute("data-cursor", "");
          return;
        }
        const rect = cursor.getBoundingClientRect();
        cursor.setAttribute(
          "data-cursor",
          rect.right >= window.innerWidth ? "active-edge" : "active",
        );
      };

      // Position only — cheap (one quickTo each), edge re-checked only while active.
      const onMove = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
        if (active) setState();
      };

      // Hover detection on element crossings (not every move).
      const onOver = (e: PointerEvent) => {
        const item =
          e.target instanceof Element
            ? e.target.closest("[data-cursor-hover]")
            : null;
        if (item === active) return;
        active = item;
        const text = item?.getAttribute("data-cursor-text") ?? "";
        gsap.to(textTarget, {
          duration: 0.6,
          overwrite: "auto",
          scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 1.2 },
        });
        setState();
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      data-cursor=""
      className="scramble-cursor"
      aria-hidden="true"
    >
      <div className="scramble-cursor__inner">
        <span
          ref={textRef}
          data-cursor-text-target
          className="scramble-cursor__text"
        />
        <svg
          className="scramble-cursor__chevron"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 22 39"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1.875 36.875L19.375 19.375L1.875 1.875"
            stroke="currentColor"
            strokeWidth="5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
