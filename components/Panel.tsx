"use client";

import { useEffect } from "react";
import { useAppStore, type PanelId } from "@/lib/store";

// Content for each in-place panel. Add a key here (and to PanelId in the store)
// to introduce a new navbar overlay — no routing needed.
const CONTENT: Record<PanelId, { title: string; body: string }> = {
  about: {
    title: "About",
    body: "BUNQ Labs is a creative studio crafting immersive, performant 3D experiences for brands that want to be felt, not just seen. We blend design, motion and real-time graphics — built natively for the open web.",
  },
  work: {
    title: "Work",
    body: "Selected projects are on the way. Check back soon — or get in touch and we'll walk you through our latest.",
  },
};

/**
 * In-place content overlay for navbar items (About / Work). Opening one swaps
 * content without a route change or reload — the SPA behaviour. Driven by the
 * `panel` store value; renders nothing when closed.
 */
export default function Panel() {
  const panel = useAppStore((s) => s.panel);
  const close = useAppStore((s) => s.closePanel);

  // Escape to close + lock background scroll while open.
  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [panel, close]);

  if (!panel) return null;

  const { title, body } = CONTENT[panel];

  return (
    <div
      className="panel-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="panel-card">
        <button
          type="button"
          className="panel-close"
          onClick={close}
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        <h2 className="panel-title">{title}</h2>
        <p className="panel-body">{body}</p>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
