import Scene from "@/components/three/Scene";
import ViewSwitch from "@/components/ViewSwitch";
import SearchBar from "@/components/ui/SearchBar";

// Server component: ships real HTML (the hero text) for SEO/first paint.
// The 3D layer hydrates on the client only — see components/three/Scene.tsx.
// ViewSwitch swaps the hero for the Work view in place (no route change).
export default function Home() {
  return (
    <>
      <div className="scene-layer">
        <Scene />
      </div>

      <main className="content-layer">
        <ViewSwitch />
      </main>

      <SearchBar />
    </>
  );
}
