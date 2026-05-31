"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { PROJECTS, PROJECT_COUNT } from "@/lib/projects";

/**
 * Work view DOM chrome. The project POSTERS are 3D tiles (see ProjectsSlider);
 * this layer only draws crisp UI: the white featured frame (built from bars with
 * a transparent window the active 3D tile shows through), the details panel, and
 * the prev/next arrows. Keyboard: ←/→ navigate, Esc returns home.
 */
export default function WorkView() {
  const index = useAppStore((s) => s.workIndex);
  const next = useAppStore((s) => s.nextProject);
  const prev = useAppStore((s) => s.prevProject);
  const goHome = useAppStore((s) => s.goHome);

  const project = PROJECTS[index];
  const isFirst = index === 0;
  const isLast = index === PROJECT_COUNT - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") goHome();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goHome]);

  if (!project) return null;

  return (
    <section className="work" aria-label="Selected work">
      {/* Featured card (left). Bars/window are pointer-events:none so clicks fall
          through to the 3D tile; only the OPEN button is interactive. */}
      <div className="work-featured">
        <span className="wf-outline" aria-hidden="true" />
        <span className="wf-bar wf-top" aria-hidden="true" />
        <span className="wf-bar wf-left" aria-hidden="true" />
        <span className="wf-bar wf-right" aria-hidden="true" />
        <span className="wf-bar wf-bottom" aria-hidden="true" />
        {/* The transparent window — its rect is what the 3D slider fills. */}
        <span id="work-featured-window" className="wf-window" aria-hidden="true" />
        <div className="wf-meta">
          <span className="wf-name">
            <span
              className="wf-dot"
              style={{ background: project.theme.secondary }}
            />
            {project.name}
          </span>
          <button
            type="button"
            className="wf-open"
            data-cursor-hover
            data-cursor-text="Open project"
          >
            Open
            <ArrowRight className="wf-open-icon" />
          </button>
        </div>
      </div>

      {/* Details (right) — re-keyed per project so the copy fades in on change. */}
      <div className="work-details" key={project.id}>
        <div className="work-tags">
          {project.tags.map((tag) => (
            <span className="work-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <h2 className="work-desc">{project.description}</h2>
        <div className="work-stats">
          {project.stats.map((stat) => (
            <div className="work-stat" key={stat.label}>
              <span className="work-stat-value">{stat.value}</span>
              <span className="work-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / next */}
      <button
        type="button"
        className="work-arrow work-arrow--prev"
        onClick={prev}
        disabled={isFirst}
        aria-label="Previous project"
        data-cursor-hover
        data-cursor-text="Previous"
      >
        <Chevron dir="left" />
      </button>
      <button
        type="button"
        className="work-arrow work-arrow--next"
        onClick={next}
        disabled={isLast}
        aria-label="Next project"
        data-cursor-hover
        data-cursor-text="Next"
      >
        <Chevron dir="right" />
      </button>

      {/* Position counter, lower-left of the details. */}
      <span className="work-counter" aria-hidden="true">
        {String(index + 1).padStart(2, "0")} / {String(PROJECT_COUNT).padStart(2, "0")}
      </span>
    </section>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 6h13M9 1l5 5-5 5" />
    </svg>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={dir === "left" ? undefined : { transform: "scaleX(-1)" }}
    >
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}
