"use client";

import { useAppStore } from "@/lib/store";

// Navbar "Work" item. Unlike About (a small overlay), Work swaps the whole
// in-place view for the project slider — so it toggles the view, not a panel.
export default function WorkNavButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const view = useAppStore((s) => s.view);
  const enterWork = useAppStore((s) => s.enterWork);
  const goHome = useAppStore((s) => s.goHome);

  const isOpen = view === "work";

  return (
    <button
      type="button"
      className={`nav-link${isOpen ? " is-active" : ""}`}
      aria-pressed={isOpen}
      onClick={isOpen ? goHome : enterWork}
    >
      {children}
    </button>
  );
}
