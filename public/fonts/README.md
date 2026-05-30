# Fonts

Drop the font files here. They are served statically from `/fonts/...` and
wired up via `@font-face` in [`app/globals.css`](../../app/globals.css).

## Required files

| Family             | File name (exact)         | Used as            | CSS variable      |
| ------------------ | ------------------------- | ------------------ | ----------------- |
| **Larken Light**   | `larken-light.woff2`      | Primary (headings) | `--font-larken`   |
| **Larken Light**   | `larken-light.woff` *(optional fallback)* | Primary | `--font-larken` |

> **Geist Mono** (secondary / mono) does **not** go here — it ships from the
> `geist` npm package and is loaded in `app/layout.tsx`. Nothing to add.

## Notes

- **Format:** `.woff2` is strongly preferred (smallest, universally supported).
  If you only have `.otf`/`.ttf`, convert them (e.g. https://www.fontsquirrel.com/tools/webfont-generator
  or `fonttools`) — raw OTF/TTF are 2–4× larger over the wire.
- **Until the file exists**, the site falls back to `Georgia, serif`, so the
  build still works — you just won't see Larken yet.
- **Licensing:** Larken is a commercial typeface. Make sure you have a webfont
  license before deploying. Keep license files out of the public folder.
- File names are **case-sensitive** on Linux/CDN hosts — match them exactly.
