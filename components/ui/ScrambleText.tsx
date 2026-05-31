"use client";

import { useEffect, useRef } from "react";

type Trigger = "mount" | "view" | "hover";

interface ScrambleTextProps {
  /** Final text. Rendered as-is for SSR/SEO/screen readers, then scrambled to. */
  children: string;
  className?: string;
  /** Tween duration in seconds. */
  duration?: number;
  /** Character set used while scrambling ("upperCase" | "lowerCase" | custom). */
  chars?: string;
  /** When to play: on mount, when scrolled into view, or on each hover. */
  trigger?: Trigger;
  /** Delay before playing (seconds). */
  delay?: number;
}

/**
 * Scramble-text effect via GSAP's ScrambleTextPlugin (bundled with gsap ≥ 3.13).
 * Renders an inline <span>; set `display` via className for block use. GSAP is
 * imported on the client only (code-split). Respects prefers-reduced-motion,
 * and the final text is in the DOM up-front (accessible / SEO-safe).
 */
export default function ScrambleText({
  children,
  className,
  duration = 1,
  chars = "upperCase",
  trigger = "mount",
  delay = 0,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Disabled on touch / phones — just show the final text.
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

      const play = () =>
        gsap.to(el, {
          duration,
          delay,
          ease: "none",
          scrambleText: { text: children, chars, speed: 1, revealDelay: 0.1 },
        });

      if (trigger === "hover") {
        const onEnter = () => play();
        el.addEventListener("pointerenter", onEnter);
        cleanup = () => el.removeEventListener("pointerenter", onEnter);
      } else if (trigger === "view") {
        const io = new IntersectionObserver(
          (entries, obs) => {
            if (entries[0]?.isIntersecting) {
              play();
              obs.disconnect();
            }
          },
          { threshold: 0.6 },
        );
        io.observe(el);
        cleanup = () => io.disconnect();
      } else {
        play();
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [children, duration, chars, trigger, delay]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
