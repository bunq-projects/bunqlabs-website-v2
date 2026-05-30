"use client";

import { useEffect, useRef } from "react";
import type { Howl } from "howler";
import { useAppStore } from "@/lib/store";

const SRC = "/audio/amb.mp3";
const VOLUME = 0.4; // ambient should sit low under the experience
const FADE_MS = 800;

/**
 * Site-wide ambient music, driven by the navbar Sound button (`soundOn`).
 *
 * - Off by default (autoplay is blocked); playback starts on the first toggle,
 *   which is a genuine user gesture so browsers allow it.
 * - The track is created lazily on first enable, so visitors who never turn
 *   sound on never download it.
 * - Fades in/out instead of hard cutting.
 *
 * Renders nothing. Mount once near the root (see app/layout.tsx).
 */
export default function AmbientAudio() {
  const soundOn = useAppStore((s) => s.soundOn);
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    let cancelled = false;
    let pauseTimer: number | undefined;

    if (soundOn) {
      (async () => {
        // Load Howler in the browser only, on demand. Keeps it out of the
        // server bundle (avoids the vendor-chunk SSR crash) and means visitors
        // who never enable sound never download it.
        const { Howl } = await import("howler");
        if (cancelled) return;
        if (!howlRef.current) {
          howlRef.current = new Howl({
            src: [SRC],
            loop: true,
            volume: 0,
            html5: true, // stream the loop instead of fully buffering it
          });
        }
        const howl = howlRef.current;
        if (!howl.playing()) howl.play();
        howl.fade(howl.volume(), VOLUME, FADE_MS);
      })();
    } else {
      // Fade out, then pause (keep the instance for reuse).
      const howl = howlRef.current;
      if (howl?.playing()) {
        howl.fade(howl.volume(), 0, FADE_MS);
        pauseTimer = window.setTimeout(() => howl.pause(), FADE_MS);
      }
    }

    return () => {
      cancelled = true;
      if (pauseTimer) window.clearTimeout(pauseTimer);
    };
  }, [soundOn]);

  // Release the audio resource when the app unmounts.
  useEffect(() => {
    return () => {
      howlRef.current?.unload();
      howlRef.current = null;
    };
  }, []);

  return null;
}
