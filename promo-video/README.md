# ALLPOWERS S2000 Pro — promo video (Remotion)

Motion-graphics promo, two formats, 30 fps, 60 s, Ukrainian voice-over:

- `Promo` — 1920×1080 (16:9)
- `PromoVertical` — 1080×1920 (9:16) for Instagram Reels / Stories, with safe zones for the app UI

- `src/scenes.tsx` — the nine 16:9 scenes; `src/scenesVertical.tsx` — their 9:16 layouts; `src/timing.json` — voice-over lengths and word cues; `src/ui.tsx` — shared components; `src/Root.tsx` — timeline.
- `public/vo/s1…s9.mp3` — voice-over per scene (generated via the Lumean API, ElevenLabs v3 voice).
- `public/img/` — product photos.

```bash
npm install
npm run studio   # preview
npm run render            # → out/allpowers-s2000-pro-promo.mp4
npm run render:vertical   # → out/allpowers-s2000-pro-reels.mp4
```

Specs come from the official S2000 Pro manual and product page (1451 Wh, 2400 W / 4000 W peak,
1500 W AC input, 1000 W solar input, UPS ≤ 15 ms, Bluetooth app, 2500+ cycles, 13 kg).
Appliance runtimes are estimates at ~85 % inverter efficiency.
