"use client";

import { useAppStore } from "@/lib/store";

// Contact isn't a page — it opens the multi-step ContactModal overlay.
export default function ContactButton() {
  const openContact = useAppStore((s) => s.openContact);

  return (
    <button
      type="button"
      className="nav-link nav-contact"
      onClick={openContact}
    >
      Contact
    </button>
  );
}
