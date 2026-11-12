# ALLPOWERS S2000 Pro — promo video (Remotion)

Motion-graphics promo, 1920×1080, 30 fps, ~87 s, Ukrainian voice-over.

- `src/scenes.tsx` — the nine scenes; `src/ui.tsx` — shared components; `src/Root.tsx` — timeline.
- `public/vo/s1…s9.mp3` — voice-over per scene (generated via the Lumean API, ElevenLabs v3 voice).
- `public/img/` — product photos.

```bash
npm install
npm run studio   # preview
npm run render   # → out/allpowers-s2000-pro-promo.mp4
```

Specs come from the official S2000 Pro manual and product page (1451 Wh, 2400 W / 4000 W peak,
1500 W AC input, 1000 W solar input, UPS ≤ 15 ms, Bluetooth app, 2500+ cycles, 13 kg).
Appliance runtimes are estimates at ~85 % inverter efficiency.
