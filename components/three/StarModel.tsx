"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import { Box3, Vector3, type Group } from "three";

const SRC = "/models/star.glb";
const TARGET_SIZE = 3; // fit the model's largest dimension to ~3 world units

// Start fetching early (during the intro loader). drei resolves the Draco
// decoder automatically, so a Draco-compressed .glb loads with no extra setup.
useGLTF.preload(SRC);

export default function StarModel() {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(SRC);

  // Normalize: scale the model so its largest dimension is TARGET_SIZE,
  // regardless of how big it was exported. Tweak TARGET_SIZE to resize.
  const scale = useMemo(() => {
    const size = new Box3().setFromObject(scene).getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return TARGET_SIZE / maxDim;
  }, [scene]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={ref} scale={scale}>
      {/* Center fixes models whose pivot isn't at the origin. */}
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}
