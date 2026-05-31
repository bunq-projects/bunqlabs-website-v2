"use client";

import Link from "next/link";
import LogoMark from "./LogoMark";
import { useAppStore } from "@/lib/store";

// Navbar logo: the reusable theme-aware mark, wrapped in a home link. Clicking it
// returns to the home view in place (no reload) — the SPA behaviour.
export default function Logo() {
  const goHome = useAppStore((s) => s.goHome);

  return (
    <Link
      href="/"
      className="logo"
      aria-label="BUNQ Labs — home"
      data-cursor-hover
      data-cursor-text="Home"
      onClick={(e) => {
        e.preventDefault();
        goHome();
      }}
    >
      <LogoMark className="logo-mark" />
    </Link>
  );
}
