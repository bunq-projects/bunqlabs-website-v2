"use client";

import { useAppStore } from "@/lib/store";

// The two hero pill buttons: "View our work" (opens the Work view) and the
// red "Contact" pill (opens the contact form).
export default function HeroActions() {
  const enterWork = useAppStore((s) => s.enterWork);
  const openContact = useAppStore((s) => s.openContact);

  return (
    <div className="hero-actions">
      <button
        type="button"
        className="pill"
        onClick={enterWork}
        data-cursor-hover
        data-cursor-text="See our work"
      >
        <span className="pill-dot" />
        View our work
      </button>

      <button
        type="button"
        className="pill pill--accent"
        onClick={openContact}
        data-cursor-hover
        data-cursor-text="Get in touch"
      >
        <span className="pill-dot" />
        Contact
      </button>
    </div>
  );
}
