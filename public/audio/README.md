# Audio

Drop site audio here. Files are served statically from `/audio/...`.

## Required file

| Purpose            | File name (exact) | Wired in                                  |
| ------------------ | ----------------- | ----------------------------------------- |
| Ambient site music | `amb.mp3`         | [`components/AmbientAudio.tsx`](../../components/AmbientAudio.tsx) |

## How it behaves

- Loops continuously for the whole site, controlled by the navbar **Sound**
  button (the `soundOn` flag in `lib/store.ts`).
- **Off by default** — browsers block autoplay, so playback only starts after
  the user clicks Sound (a real user gesture).
- **Lazy-loaded** — the file isn't downloaded until sound is first enabled, so
  visitors who never turn it on pay zero bandwidth for it.
- Fades in/out (~0.8s) on toggle.

## Notes

- **Format:** `.mp3` is the safe universal choice. For best quality-per-byte
  you can also add `amb.webm` (Opus) and list both as sources — Howler picks
  the first the browser supports. Keep the file reasonably small (it loops):
  128–160 kbps mono is usually plenty for ambient.
- **Seamless loop:** trim silence at the very start/end so the loop point is
  clean, or you'll hear a gap on each repeat.
- **Licensing:** make sure the track is licensed for web/commercial use before
  deploying. Keep license docs out of this public folder.
- Until `amb.mp3` exists, the Sound button still toggles — it just has nothing
  to play yet.
