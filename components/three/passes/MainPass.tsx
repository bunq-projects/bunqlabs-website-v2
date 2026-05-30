"use client";

import { Environment } from "@react-three/drei";
import { useAppStore } from "@/lib/store";
import { palettes } from "@/lib/theme";
import StarModel from "../StarModel";

/**
 * PASS 2 — MAIN
 * The actual 3D content: objects, planes, models, lighting.
 * Loaders (useGLTF) are wrapped in the <Suspense> boundary in Experience.tsx
 * so async assets don't block the first frame.
 */
export default function MainPass() {
  const theme = useAppStore((s) => s.theme);
  const p = palettes[theme];

  return (
    <group>
      <StarModel />

      {/* Image-based lighting only — no direct lights. This is what keeps the
          model's PBR materials visible now that ambient/directional lights are
          removed. */}
      <Environment preset={p.envPreset} />
    </group>
  );
}
