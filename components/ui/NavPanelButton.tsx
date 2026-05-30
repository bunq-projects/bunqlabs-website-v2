"use client";

import { useAppStore, type PanelId } from "@/lib/store";

// Navbar item that opens an in-place content overlay instead of navigating to
// a separate page — keeps the experience a single-page app (no reload).
export default function NavPanelButton({
  id,
  children,
}: {
  id: PanelId;
  children: React.ReactNode;
}) {
  const openPanel = useAppStore((s) => s.openPanel);

  return (
    <button type="button" className="nav-link" onClick={() => openPanel(id)}>
      {children}
    </button>
  );
}
