"use client";

import { useEffect, useState } from "react";
import LogoMark from "@/components/ui/LogoMark";

/**
 * Intro loader / enter gate.
 *
 * - Covers the whole screen on load (themed via --bg/--fg).
 * - Stays up for a minimum of 2s, then reveals the Enter button.
 * - Only dismisses when the user clicks Enter (a real user gesture — handy if
 *   you later want to start audio from here, since autoplay is blocked).
 *
 * Mounted once near the root (see app/layout.tsx). Renders on the server with
 * ready=false/dismissed=false, matching the client's first render — no
 * hydration mismatch.
 */
const MIN_DURATION_MS = 2000;
const FADE_MS = 500;

export default function Loader() {
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Minimum on-screen time before the Enter button appears.
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), MIN_DURATION_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Lock background scroll while the loader is up.
  useEffect(() => {
    if (dismissed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [dismissed]);

  if (dismissed) return null;

  const handleEnter = () => {
    setLeaving(true);
    window.setTimeout(() => setDismissed(true), FADE_MS);
  };

  return (
    <div
      className={`loader${leaving ? " is-leaving" : ""}`}
      role="dialog"
      aria-label="Intro"
      aria-busy={!ready}
    >
      <div className="loader-inner">
        <LogoMark size={48} />
        <p className="loader-name">BUNQ Labs</p>

        {ready ? (
          <button
            type="button"
            className="loader-enter"
            onClick={handleEnter}
            autoFocus
          >
            Enter
          </button>
        ) : (
          <div className="loader-bar" aria-hidden="true">
            <span />
          </div>
        )}
      </div>
    </div>
  );
}
