/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static build: `next build` emits a plain HTML/JS/CSS site into `out/`.
  // No Node server runs per request — deploy `out/` to any CDN (Cloudflare
  // Pages, S3+CloudFront, Netlify, GitHub Pages) for cheap, fast hosting.
  output: "export",

  // The static export has no server, so Next's on-demand image optimizer
  // can't run. Serve images as-is (optimize them in your asset pipeline).
  images: {
    unoptimized: true,
  },

  // Emit `/about/index.html` instead of `/about.html` so clean URLs work on
  // any static host without extra rewrite rules.
  trailingSlash: true,

  reactStrictMode: true,
};

export default nextConfig;
