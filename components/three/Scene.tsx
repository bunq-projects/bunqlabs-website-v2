"use client";

import dynamic from "next/dynamic";

// The Canvas (WebGL) must never render on the server. We're doing a static
// export, but React still hydrates on the client — `ssr: false` keeps Three.js
// out of the server/SSG render pass entirely. This wrapper is a client
// component, which is required for `dynamic(..., { ssr: false })`.
const Experience = dynamic(() => import("./Experience"), {
  ssr: false,
  loading: () => null,
});

export default function Scene() {
  return <Experience />;
}
