"use client";

import { useState } from "react";

// Bottom-center "Ask something…" bar + send button (per the design).
// Visual + typeable for now; not wired to a backend yet.
export default function SearchBar() {
  const [value, setValue] = useState("");

  const submit = () => {
    const q = value.trim();
    if (!q) return;
    // TODO: wire to search / AI endpoint.
    console.log("Search:", q);
  };

  return (
    <div className="search-bar">
      <form
        className="search-pill"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <span className="pill-dot" />
        <input
          className="search-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask something..."
          aria-label="Ask something"
        />
      </form>

      <button
        type="button"
        className="search-send"
        onClick={submit}
        aria-label="Send"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}
