# Zahnprophylaxe für die FSP — Lernvideo (Remotion)

Motion-graphics explainer, 1920×1080, 30 fps, ~5:24, German voice-over with subtitles.
Eleven chapters: Prävention (3 Stufen), Biofilm, Abrasion/Erosion/Attrition, API & PBI,
Mundhygiene, 7 Maßnahmen der DGZMK, PZR, Fissurenversiegelung, Ablauf, Zusammenfassung.

- `scripts/script.json` — narration per chapter plus the cue words that trigger animations.
- `scripts/build_timing.py` — splits the full voice-over into `public/vo/<n>.mp3` and writes
  `src/timing.json` (chapter lengths, cue times, subtitle lines) from the TTS alignment file.
- `src/ui.tsx` — theme, chapter frame, subtitles, progress bar; `src/scenesA.tsx`, `src/scenesB.tsx` — the chapters.

```bash
npm install
npm run studio   # preview
npm run render   # → out/prophylaxe-fsp.mp4
```
