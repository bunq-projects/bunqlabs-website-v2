"use client";

import { useMemo, useRef, useLayoutEffect, useEffect } from "react";
import { useThree, useFrame, type ThreeEvent } from "@react-three/fiber";
import { PlaneGeometry, type Mesh, type Texture } from "three";
import gsap from "gsap";
import { PROJECTS } from "@/lib/projects";
import { makePosterTexture } from "@/lib/posterTexture";
import { useAppStore } from "@/lib/store";

// The project tiles, rendered as textured planes. ONE layout (the slider) drives
// where each tile sits; the same tiles can later be laid out as a masonry grid or
// a sphere by swapping the per-tile transform — that's why they live in WebGL.
//
// Performance model: a single GSAP-tweened float (`progress` = the active index,
// animated) drives everything. Each frame we map each tile's offset from the
// active index to a transform — the active tile rises into the featured slot, the
// rest sit in a bottom filmstrip. No per-tile tweens, no slider library.

const POSTER_ASPECT = 357 / 433; // featured fallback aspect (matches the design)
const STRIP_ASPECT = 148 / 174; // filmstrip tile aspect

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
const smooth = (x: number) => {
  const t = clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function ProjectsSlider() {
  const workIndex = useAppStore((s) => s.workIndex);
  const setProject = useAppStore((s) => s.setProject);

  const { gl, camera, size, viewport } = useThree();

  // One shared geometry (unit plane, scaled per tile); per-tile poster textures.
  const geometry = useMemo(() => new PlaneGeometry(1, 1), []);
  const textures = useMemo<Texture[]>(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy?.() ?? 1;
    return PROJECTS.map((p) => {
      const t = makePosterTexture(p);
      t.anisotropy = maxAniso;
      return t;
    });
  }, [gl]);

  useEffect(
    () => () => {
      geometry.dispose();
      textures.forEach((t) => t.dispose());
    },
    [geometry, textures],
  );

  const meshRefs = useRef<(Mesh | null)[]>([]);
  const progress = useRef({ v: workIndex });
  const mounted = useRef(false);

  // Straight-on camera for the slider (undo any orbit done in the home view).
  useLayoutEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Animate `progress` toward the active index — one tweened float for the slide.
  // Snap (no tween) on first mount so we don't slide in from index 0.
  useEffect(() => {
    if (!mounted.current) {
      progress.current.v = workIndex;
      mounted.current = true;
      return;
    }
    gsap.to(progress.current, {
      v: workIndex,
      duration: 0.75,
      ease: "power3.inOut",
      overwrite: true,
    });
  }, [workIndex]);

  // The active tile fills the DOM featured window exactly: read its rect and
  // convert to world units (the canvas covers the viewport, so px map directly).
  // Falls back to design-matched proportions until the DOM is measurable.
  function featuredWorld(): Rect {
    const vw = viewport.width;
    const vh = viewport.height;
    const el =
      typeof document !== "undefined"
        ? document.getElementById("work-featured-window")
        : null;
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width > 1 && r.height > 1) {
        const ppx = vw / size.width;
        const ppy = vh / size.height;
        return {
          x: (r.left + r.width / 2 - size.width / 2) * ppx,
          y: -(r.top + r.height / 2 - size.height / 2) * ppy,
          w: r.width * ppx,
          h: r.height * ppy,
        };
      }
    }
    const h = vh * 0.535;
    return { x: -vw * 0.17, y: vh * 0.03, w: h * POSTER_ASPECT, h };
  }

  useFrame(() => {
    const vw = viewport.width;
    const vh = viewport.height;
    const f = featuredWorld();

    // Filmstrip geometry (lower third of the viewport, derived from its size;
    // kept clear of the bottom search bar).
    const sh = vh * 0.18;
    const sw = sh * STRIP_ASPECT;
    const step = sw * 1.16;
    const sy = -vh * 0.24;
    const srx = vw * 0.07; // first upcoming slot   (offset d = +1)
    const slx = -vw * 0.4; // first past slot       (offset d = -1)

    const p = progress.current.v;

    for (let i = 0; i < PROJECTS.length; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;

      const d = i - p; // offset from the active index
      const ad = Math.min(1, Math.abs(d));
      const u = smooth(ad); // 0 at featured → 1 at the first strip slot
      const baseStripX = d >= 0 ? srx : slx;

      let x = lerp(f.x, baseStripX, u);
      const y = lerp(f.y, sy, u);
      const w = lerp(f.w, sw, u);
      const h = lerp(f.h, sh, u);
      if (d > 1) x += (d - 1) * step;
      else if (d < -1) x -= (-d - 1) * step;

      // All tiles sit on z = 0 so the featured tile aligns 1:1 with the DOM
      // window; overlap order during slides is handled by renderOrder below
      // (depthWrite is off on the material).
      mesh.position.set(x, y, 0);
      mesh.scale.set(w, h, 1);
      mesh.renderOrder = Math.round((1 - ad) * 100); // featured draws on top
      mesh.visible = Math.abs(x) < vw * 0.95; // cull tiles off-screen
    }
  });

  return (
    <group>
      {PROJECTS.map((p, i) => (
        <mesh
          key={p.id}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={geometry}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            setProject(i);
          }}
        >
          <meshBasicMaterial
            map={textures[i]}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
