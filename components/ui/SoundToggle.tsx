"use client";

import { useAppStore } from "@/lib/store";

// Toggles the global `soundOn` flag. Playback (Howler, /audio/amb.mp3) lives in
// components/AmbientAudio.tsx, which reacts to this flag. Browsers block
// autoplay, so sound must start from this user gesture. Defaults to off.
export default function SoundToggle() {
  const soundOn = useAppStore((s) => s.soundOn);
  const toggleSound = useAppStore((s) => s.toggleSound);

  return (
    <button
      type="button"
      onClick={toggleSound}
      className="nav-btn"
      aria-pressed={soundOn}
      aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
    >
      <span className="nav-btn-label">{soundOn ? "Sound" : "Muted"}</span>
      <SoundIcon on={soundOn} />
    </button>
  );
}

function SoundIcon({ on }: { on: boolean }) {
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
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      {on ? (
        <>
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </>
      ) : (
        <>
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </>
      )}
    </svg>
  );
}
