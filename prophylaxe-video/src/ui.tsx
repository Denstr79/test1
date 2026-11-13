import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import T from './timing.json';

export const C = {
  bg: '#f3f8f7',
  ink: '#0d2b3a',
  dim: '#5b7482',
  line: '#d7e3e3',
  card: '#ffffff',
  teal: '#0fb5a6',
  tealDark: '#0a8f84',
  tealSoft: '#dff5f2',
  coral: '#ff6257',
  coralSoft: '#ffe7e4',
  amber: '#f5a300',
  amberSoft: '#fff1d1',
  violet: '#7b5cff',
  violetSoft: '#ebe6ff',
  blue: '#2f8cff',
};
export const FONT = 'Inter, "Inter Display", sans-serif';
export const FPS = 30;
/** Voice-over starts this many seconds into every scene. */
export const LEAD = 0.4;
const TAIL = 0.7;

export const scenes = T as unknown as {id: string; title: string; dur: number; cues: Record<string, number>; subs: {t: number; text: string}[]}[];
export const sceneFrames = scenes.map((s, i) => Math.ceil((s.dur + LEAD + (i === scenes.length - 1 ? 2.2 : TAIL)) * FPS));
export const TOTAL = sceneFrames.reduce((a, b) => a + b, 0);

/** Seconds into the scene at which a cue word is spoken. */
export const cue = (n: number, key: string) => LEAD + (scenes[n - 1].cues[key] ?? 0);

export const useSec = () => useCurrentFrame() / useVideoConfig().fps;

/** Spring 0→1 starting at `at` seconds. */
export const useIn = (at: number, damping = 16) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at * fps, fps, config: {damping, mass: 0.7}});
};

/** Linear-eased 0→1 between two times. */
export const useRamp = (from: number, to: number) => {
  const s = useSec();
  return interpolate(s, [from, to], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)});
};

export const Pop: React.FC<{at: number; y?: number; x?: number; scale?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  at,
  y = 36,
  x = 0,
  scale = 1,
  style,
  children,
}) => {
  const p = useIn(at);
  return (
    <div style={{opacity: Math.min(1, p * 1.3), translate: `${(1 - p) * x}px ${(1 - p) * y}px`, scale: String(scale + (1 - scale) * p), ...style}}>{children}</div>
  );
};

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; accent?: string}> = ({children, style, accent}) => (
  <div
    style={{
      background: C.card,
      borderRadius: 28,
      padding: '28px 32px',
      boxShadow: '0 14px 40px rgba(13,43,58,0.08), 0 2px 6px rgba(13,43,58,0.05)',
      borderTop: accent ? `8px solid ${accent}` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Term: React.FC<{children: React.ReactNode; color?: string; bg?: string; size?: number}> = ({children, color = C.tealDark, bg = C.tealSoft, size = 30}) => (
  <span style={{display: 'inline-block', padding: `${size * 0.3}px ${size * 0.6}px`, borderRadius: 999, background: bg, color, fontSize: size, fontWeight: 700, whiteSpace: 'nowrap'}}>
    {children}
  </span>
);

export const H1: React.FC<{children: React.ReactNode; at?: number; size?: number}> = ({children, at = 0.1, size = 76}) => (
  <Pop at={at} y={24}>
    <div style={{fontSize: size, fontWeight: 800, letterSpacing: -2, lineHeight: 1.08, color: C.ink}}>{children}</div>
  </Pop>
);

/** Molar outline. `fill` is the enamel colour. */
export const Tooth: React.FC<{size?: number; fill?: string; stroke?: string; children?: React.ReactNode; style?: React.CSSProperties}> = ({
  size = 200,
  fill = '#ffffff',
  stroke = C.ink,
  children,
  style,
}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{overflow: 'visible', ...style}}>
    <path
      d="M40 62 C38 22 80 10 100 32 C120 10 162 22 160 62 C164 110 150 130 145 170 C142 206 135 246 120 246 C108 246 110 192 100 192 C90 192 92 246 80 246 C65 246 58 206 55 170 C50 130 36 110 40 62 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={7}
      strokeLinejoin="round"
    />
    <path d="M62 60 C64 44 78 38 88 44" fill="none" stroke={C.line} strokeWidth={7} strokeLinecap="round" />
    {children}
  </svg>
);

const SUB_FIX: [RegExp, string][] = [
  [/A-P-I/g, 'API'],
  [/P-B-I/g, 'PBI'],
  [/P-Z-R/g, 'PZR'],
  [/tausend bis fünfzehnhundert/g, '1000 bis 1500'],
];
const fix = (t: string) => SUB_FIX.reduce((a, [r, v]) => a.replace(r, v), t);

const Subtitles: React.FC<{n: number}> = ({n}) => {
  const s = useSec() - LEAD;
  const subs = scenes[n - 1].subs;
  let cur = -1;
  for (let i = 0; i < subs.length; i++) if (s >= subs[i].t - 0.05) cur = i;
  if (cur < 0 || s > scenes[n - 1].dur + 0.2) return null;
  const age = s - subs[cur].t;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 62, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          background: 'rgba(13,43,58,0.92)',
          color: '#fff',
          fontSize: 34,
          fontWeight: 500,
          padding: '14px 34px',
          borderRadius: 18,
          maxWidth: 1560,
          textAlign: 'center',
          opacity: interpolate(age, [0, 0.15], [0.4, 1], {extrapolateRight: 'clamp'}),
        }}
      >
        {fix(subs[cur].text)}
      </div>
    </div>
  );
};

const Progress: React.FC<{n: number}> = ({n}) => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / sceneFrames[n - 1]);
  return (
    <div style={{position: 'absolute', left: 80, right: 80, bottom: 26, display: 'flex', gap: 8}}>
      {scenes.map((s, i) => (
        <div key={s.id} style={{flex: s.dur, height: 8, borderRadius: 4, background: C.line, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${(i < n - 1 ? 1 : i === n - 1 ? p : 0) * 100}%`, background: C.teal}} />
        </div>
      ))}
    </div>
  );
};

const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 700px at ${82 + Math.sin(frame / 120) * 4}% 8%, rgba(15,181,166,0.16), transparent 70%), radial-gradient(800px 600px at ${6 + Math.cos(frame / 140) * 4}% 96%, rgba(47,140,255,0.10), transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{backgroundImage: `radial-gradient(${C.line} 2px, transparent 2px)`, backgroundSize: '44px 44px', opacity: 0.55}} />
    </AbsoluteFill>
  );
};

/** Frame around every scene: backdrop, chapter header, subtitles, progress bar. */
export const Shell: React.FC<{n: number; children: React.ReactNode}> = ({n, children}) => {
  const frame = useCurrentFrame();
  const dur = sceneFrames[n - 1];
  const o = interpolate(frame, [0, 10, dur - 10, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{fontFamily: FONT, color: C.ink}}>
      <Backdrop />
      <AbsoluteFill style={{opacity: o}}>
        <div style={{position: 'absolute', left: 80, right: 80, top: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <div style={{width: 58, height: 58, borderRadius: 18, background: C.teal, color: '#fff', fontSize: 28, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {String(n).padStart(2, '0')}
            </div>
            <div style={{fontSize: 30, fontWeight: 700, color: C.ink}}>{scenes[n - 1].title}</div>
          </div>
          <div style={{fontSize: 24, fontWeight: 600, color: C.dim, letterSpacing: 1}}>FSP ZAHNMEDIZIN · PROPHYLAXE</div>
        </div>
        <div style={{position: 'absolute', left: 80, right: 80, top: 140, bottom: 170}}>{children}</div>
      </AbsoluteFill>
      <Subtitles n={n} />
      <Progress n={n} />
    </AbsoluteFill>
  );
};
