"use client";

import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  OrbitControls,
  PerformanceMonitor,
} from "@react-three/drei";
import { Suspense, useState } from "react";
import BackgroundPass from "./passes/BackgroundPass";
import MainPass from "./passes/MainPass";
import ForegroundPass from "./passes/ForegroundPass";

export default function Experience() {
  // Quality tier: drops device pixel ratio if the frame rate sags, so weak
  // GPUs/phones stay smooth instead of stuttering. The single most important
  // knob for a perf-conscious immersive site.
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(2)}
        onDecline={() => setDpr(1)}
      >
        {/* Pass 1 — background: patterns / textures / images */}
        <BackgroundPass />

        {/* Pass 2 — main: 3D objects / planes / models */}
        <Suspense fallback={null}>
          <MainPass />
        </Suspense>

        {/* Pass 3 — foreground: postprocessing effects */}
        <ForegroundPass />
      </PerformanceMonitor>

      <OrbitControls enablePan={false} enableZoom={false} />
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
