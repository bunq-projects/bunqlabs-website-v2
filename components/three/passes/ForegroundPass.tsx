"use client";

/**
 * PASS 3 — FOREGROUND
 * Postprocessing applied to the whole rendered frame (the "foreground" pass).
 *
 * Currently empty — no effects by request. The pass is kept as the structural
 * slot so the 3-pass architecture stays intact.
 *
 * To add effects later, wrap them in an EffectComposer (already installed via
 * @react-three/postprocessing):
 *
 *   import { EffectComposer, Bloom } from "@react-three/postprocessing";
 *   return (
 *     <EffectComposer>
 *       <Bloom intensity={0.6} luminanceThreshold={0.25} mipmapBlur />
 *     </EffectComposer>
 *   );
 *
 * EffectComposer reads the renderer/scene/camera from context, so it post-
 * processes everything in passes 1 + 2. Keep the chain short on mobile.
 */
export default function ForegroundPass() {
  return null;
}
