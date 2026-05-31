// Project catalogue for the Work view. Each project is fully self-describing:
// its own 2-color theme (applied when it becomes active), the copy shown in the
// details panel, and an optional poster image. When `poster` is null a themed
// placeholder is generated procedurally (see lib/posterTexture.ts) so the slider
// works before real artwork exists — drop a file in /public/work and set `poster`
// to swap it in. Themes/images here are placeholders to be replaced per project.

import type { ThemeColors } from "./theme";

export interface ProjectStat {
  /** Headline figure, e.g. "25%". */
  value: string;
  /** Short caption under it, e.g. "Conversion rate on website". */
  label: string;
}

export interface Project {
  id: string;
  /** Display name / wordmark text (shown by the featured card). */
  name: string;
  /** Small disciplines shown as pills, e.g. ["Branding", "Website Design"]. */
  tags: string[];
  /** The big serif line in the details panel. */
  description: string;
  /** Up to three figures shown beneath the description. */
  stats: ProjectStat[];
  /** The project's 2-color theme, applied to the whole site when it's active. */
  theme: ThemeColors;
  /** Optional poster path under /public (e.g. "/work/ember.webp"). */
  poster: string | null;
}

export const PROJECTS: Project[] = [
  {
    id: "ember",
    name: "Ember",
    tags: ["Branding", "Website Design"],
    description:
      "Designing a brand for a platform which offers instant loans for medical emergencies.",
    stats: [
      { value: "25%", label: "Conversion rate on website" },
      { value: "3.2x", label: "Faster loan approvals" },
      { value: "40k", label: "Users in first quarter" },
    ],
    theme: { primary: "#6a0dad", secondary: "#ffd700" },
    poster: null,
  },
  {
    id: "nimbus",
    name: "Nimbus",
    tags: ["Product", "Web App"],
    description:
      "A weather intelligence dashboard that turns raw forecast data into calm, legible decisions.",
    stats: [
      { value: "62%", label: "Drop in support tickets" },
      { value: "1.4s", label: "Median time to insight" },
      { value: "4.9", label: "App store rating" },
    ],
    theme: { primary: "#0a2540", secondary: "#7fd1ff" },
    poster: null,
  },
  {
    id: "verde",
    name: "Verde",
    tags: ["Branding", "Packaging"],
    description:
      "Rebranding a regenerative grocer around a system that makes sustainability feel effortless.",
    stats: [
      { value: "2.1x", label: "Retail shelf recall" },
      { value: "18%", label: "Lift in repeat orders" },
      { value: "30+", label: "SKUs unified" },
    ],
    theme: { primary: "#0b3d2e", secondary: "#c8f560" },
    poster: null,
  },
  {
    id: "sona",
    name: "Sona",
    tags: ["Experience", "Motion"],
    description:
      "An immersive launch experience for a music label, scored to react to every scroll.",
    stats: [
      { value: "5m", label: "Average session length" },
      { value: "78%", label: "Shared the experience" },
      { value: "12", label: "Awards & features" },
    ],
    theme: { primary: "#2b1055", secondary: "#ff5e9a" },
    poster: null,
  },
  {
    id: "koto",
    name: "Koto",
    tags: ["Branding", "Editorial"],
    description:
      "A bold editorial identity for an independent design studio with a point of view.",
    stats: [
      { value: "3x", label: "Inbound enquiries" },
      { value: "90%", label: "Proposal win rate" },
      { value: "24", label: "Issues published" },
    ],
    theme: { primary: "#161616", secondary: "#ff6a00" },
    poster: null,
  },
  {
    id: "halo",
    name: "Halo",
    tags: ["Product", "Design System"],
    description:
      "A unified design system that let a fintech ship consistent product across ten surfaces.",
    stats: [
      { value: "10", label: "Surfaces unified" },
      { value: "55%", label: "Faster feature delivery" },
      { value: "120", label: "Components shipped" },
    ],
    theme: { primary: "#101418", secondary: "#e8e8e8" },
    poster: null,
  },
];

export const PROJECT_COUNT = PROJECTS.length;
