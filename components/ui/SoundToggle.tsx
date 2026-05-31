"use client";

import { useAppStore } from "@/lib/store";

// Navbar sound control, styled as text ("SOUND: ON" / "SOUND: OFF") per the
// design. Toggles the global `soundOn` flag (playback lives in AmbientAudio).
export default function SoundToggle() {
  const soundOn = useAppStore((s) => s.soundOn);
  const toggleSound = useAppStore((s) => s.toggleSound);

  return (
    <button
      type="button"
      className="nav-link"
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
    >
      Sound: {soundOn ? "On" : "Off"}
    </button>
  );
}
