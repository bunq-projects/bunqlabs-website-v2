import Scene from "@/components/three/Scene";
import RotatingHeading from "@/components/ui/RotatingHeading";

// Server component: ships real HTML (text below) for SEO/first paint.
// The 3D layer hydrates on the client only — see components/three/Scene.tsx.
export default function Home() {
  return (
    <>
      <div className="scene-layer">
        <Scene />
      </div>

      <main className="content-layer">
        <section className="hero">
          <RotatingHeading />
        </section>
      </main>
    </>
  );
}
