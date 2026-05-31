"use client";

import { useAppStore } from "@/lib/store";
import Hero from "./ui/Hero";
import WorkView from "./work/WorkView";

// Swaps the in-place content between the home hero and the Work view — no route
// change (the SPA behaviour). The 3D layer swaps in parallel via MainPass.
export default function ViewSwitch() {
  const view = useAppStore((s) => s.view);
  return view === "work" ? <WorkView /> : <Hero />;
}
