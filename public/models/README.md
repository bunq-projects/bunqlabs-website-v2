# 3D Models

Drop model files here. They're served statically from `/models/...` and loaded
on the client by the 3D scene (R3F / drei).

## Format

| Want                | Use                                                             |
| ------------------- | -------------------------------------------------------------- |
| **File format**     | `.glb` (binary glTF) — single file, includes geometry + textures |
| **Geometry**        | **Draco**-compressed (often 5–10× smaller meshes)              |
| **Textures**        | **KTX2 / Basis** (GPU-compressed, far less VRAM than PNG/JPG)  |

> `.glb` over `.gltf+bin+textures` — one request, no broken relative paths.
> Avoid raw `.fbx`/`.obj` for the web; convert to glTF first.

## Optimise before committing

Run a model through [gltf-transform](https://gltf.report) or the CLI to Draco-
compress geometry and KTX2 textures:

```bash
npx @gltf-transform/cli optimize input.glb public/models/hero.glb \
  --compress draco --texture-compress ktx2
```

Keep an eye on total size — an immersive scene should aim to stay within a few
MB of model/texture data. Big files = slow first load (bandwidth is the main
hosting cost on a static site).

## How to use one in the scene

Models render in **Pass 2** — [`components/three/passes/MainPass.tsx`](../../components/three/passes/MainPass.tsx).
drei's `useGLTF` handles loading (and Draco/KTX2 decoding) and is wrapped in the
`<Suspense>` boundary that already exists in `Experience.tsx`:

```tsx
import { useGLTF } from "@react-three/drei";

function HeroModel() {
  const { scene } = useGLTF("/models/hero.glb");
  return <primitive object={scene} />;
}

// Preload so it starts fetching early (e.g. during the intro loader):
useGLTF.preload("/models/hero.glb");
```

**Draco note:** drei auto-loads the Draco decoder from a CDN. To self-host it
(no third-party fetch — `draco3d` is already installed), copy the decoder into
`public/draco/` and point drei at it:

```tsx
useGLTF("/models/hero.glb", "/draco/");
```

Ping me when you've added a model and I'll wire it into MainPass (lighting,
scale, position, and a Draco/KTX2 loader setup if needed).
```
