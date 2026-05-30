"use client";

import { useEffect, useRef } from "react";

// The first word shows on load and is the accessible word in the sentence
// "Elevating brands for the higher ground".
const WORDS = ["brands", "websites", "packaging", "design", "experiences"];

const STEP_DURATION = 2; // seconds each word stays before rotating
const IN_DURATION = 0.75;
const OUT_DURATION = 0.6;

/**
 * Hero heading with an inline word that continuously rotates through WORDS.
 *
 * Alignment approach: an invisible in-flow "ghost" word gives the slot its
 * height + baseline so it lines up with the surrounding text. The animated
 * words live in an absolutely-positioned mask layer (overflow clipped) — being
 * out of flow, the mask can't shift the heading's baseline. The slot width is
 * morphed on the .rotating element so the sentence reflows smoothly.
 */
export default function RotatingHeading() {
  const rotatingRef = useRef<HTMLSpanElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    let stop: (() => void) | null = null;

    const run = async () => {
      const rotating = rotatingRef.current;
      const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (!rotating || words.length === 0) return;

      // Measure after webfonts load so word widths are correct.
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          /* non-fatal */
        }
      }
      if (cancelled) return;

      // Client-only GSAP (kept out of the server bundle, code-split to the hero).
      const { default: gsap } = await import("gsap");
      if (cancelled) return;

      gsap.set(words, { yPercent: 150, autoAlpha: 0 });
      gsap.set(words[0], { yPercent: 0, autoAlpha: 1 });
      gsap.set(rotating, { width: words[0].getBoundingClientRect().width });

      let active = 0;
      let pending: { kill: () => void } | null = null;

      const showNext = () => {
        if (cancelled) return;
        const next = (active + 1) % words.length;
        const prev = words[active];
        const current = words[next];

        // Morph the slot width to the new word so the sentence reflows.
        gsap.to(rotating, {
          width: current.getBoundingClientRect().width,
          duration: IN_DURATION,
          ease: "power4.inOut",
        });
        // Slide the old word up and out.
        gsap.to(prev, {
          yPercent: -150,
          autoAlpha: 0,
          duration: OUT_DURATION,
          ease: "power4.inOut",
        });
        // Slide the new word up from below.
        gsap.fromTo(
          current,
          { yPercent: 150, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: IN_DURATION,
            ease: "power4.inOut",
          },
        );

        active = next;
        pending = gsap.delayedCall(STEP_DURATION, showNext);
      };

      pending = gsap.delayedCall(STEP_DURATION, showNext);

      stop = () => {
        pending?.kill();
        gsap.killTweensOf(words);
        gsap.killTweensOf(rotating);
      };
    };

    run();

    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);

  return (
    <h1>
      {/* Line 1 never wraps internally, so the changing word width can't bump
          words between lines. */}
      <span className="hero-line">
        Elevating{" "}
        <span className="rotating" ref={rotatingRef} aria-hidden="true">
          {/* in-flow, invisible — sizes the slot and sets the baseline */}
          <span className="rotating-ghost">{WORDS[0]}</span>
          {/* out-of-flow mask — clips sliding words without moving the baseline */}
          <span className="rotating-mask">
            {WORDS.map((word, i) => (
              <span
                key={word}
                className={`rotating-word${i === 0 ? " is-first" : ""}`}
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
              >
                {word}
              </span>
            ))}
          </span>
        </span>
        <span className="sr-only">{WORDS[0]}</span> for the
      </span>
      <br />
      higher ground
    </h1>
  );
}
