# Cursors

Drop cursor sprites/images here. They're served statically from `/cursors/...`.

## Format & size

| Want                | Use                                                                |
| ------------------- | ------------------------------------------------------------------ |
| **Format**          | `.png` (alpha transparency) or `.svg`. `.webp` works in modern browsers. |
| **Size (native)**   | Keep ≤ **128×128px** — browsers ignore larger as a real cursor. 32×32 is typical. |
| **Size (JS cursor)**| Any size — it's just an image in a `<div>` you position.           |

## Two ways to use them

### 1. Native CSS cursor (simple, OS-drawn, no lag)

```css
.some-element {
  /* the two numbers are the hotspot (x y) — the active "tip" pixel */
  cursor: url("/cursors/pointer.png") 16 16, auto;
}
```

- Always include a **fallback keyword** (`auto`, `pointer`, …) after the comma.
- The **hotspot** defaults to the top-left (0 0) — set it to where the click should register (e.g. a centered dot → half the width/height).
- Can't be animated or scaled on hover. Best for a static custom pointer.

### 2. JS custom cursor element (immersive — follows, scales, swaps sprites)

A `<div>` pinned to the pointer that can lerp/ease behind the mouse, grow on
hover, and swap between sprites in this folder (e.g. default → "view" on a
project card). This is the common approach for agency sites and pairs well with
the GSAP already installed. Hide the native cursor (`cursor: none`) while it's on.

## Notes

- **Accessibility:** keep a sensible fallback and don't fully hide the cursor on
  interactive controls without a clear visual substitute. Respect
  `prefers-reduced-motion` for any cursor animation.
- **Touch devices** have no cursor — gate the JS cursor behind a pointer check
  (`matchMedia('(pointer: fine)')`).

When you've added images, tell me what behavior you want (static swap vs. a
following/animated cursor with hover states) and I'll wire it up.
