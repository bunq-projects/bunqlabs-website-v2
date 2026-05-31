"use client";

import { Environment } from "@react-three/drei";
import StarModel from "../StarModel";
import ProjectsSlider from "../ProjectsSlider";
import { useAppStore } from "@/lib/store";

/**
 * PASS 2 — MAIN
 * The 3D content, swapped by the active view:
 *   home → the spinning star (lit by a fixed, theme-independent Environment)
 *   work → the project tiles slider (unlit MeshBasicMaterial — no Environment).
 * Loaders are wrapped in the <Suspense> boundary in Experience.tsx.
 */
export default function MainPass() {
  const view = useAppStore((s) => s.view);

  if (view === "work") return <ProjectsSlider />;

  return (
    <group>
      <StarModel />
      <Environment preset="city" />
    </group>
  );
}
