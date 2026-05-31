"use client";

import { useAppStore } from "@/lib/store";

// Manual light/dark switch for the site base theme. Updates the store, the two
// CSS color vars, localStorage, AND the 3D scene (which reads from the store).
export default function ThemeToggle() {
  const baseName = useAppStore((s) => s.baseName);
  const toggleBaseTheme = useAppStore((s) => s.toggleBaseTheme);
  const isDark = baseName === "dark";

  return (
    <button
      type="button"
      onClick={toggleBaseTheme}
      className="nav-btn"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <ThemeIcon isDark={isDark} />
    </button>
  );
}

function ThemeIcon({ isDark }: { isDark: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {isDark ? (
        // Moon → tap to go light
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      ) : (
        // Sun → tap to go dark
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      )}
    </svg>
  );
}
