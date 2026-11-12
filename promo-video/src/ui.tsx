import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const C = {
  bg: '#07090d',
  panel: 'rgba(255,255,255,0.045)',
  line: 'rgba(255,255,255,0.10)',
  text: '#f3f6fa',
  dim: '#8d98a8',
  green: '#8cff4b',
  cyan: '#22c8ff',
};
export const FONT = 'Inter, "Inter Display", sans-serif';

/** Seconds → spring progress 0..1 starting at `at` seconds. */
export const useIn = (at: number, damping = 18) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at * fps, fps, config: {damping, mass: 0.7}});
};

export const useSec = () => useCurrentFrame() / useVideoConfig().fps;

export const Rise: React.FC<{at: number; y?: number; x?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  at,
  y = 40,
  x = 0,
  style,
  children,
}) => {
  const p = useIn(at);
  return (
    <div style={{opacity: p, transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px)`, ...style}}>{children}</div>
  );
};

export const Counter: React.FC<{to: number; at: number; dur?: number; decimals?: number}> = ({to, at, dur = 1.2, decimals = 0}) => {
  const s = useSec();
  const v = interpolate(s, [at, at + dur], [0, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  return <>{v.toFixed(decimals).replace('.', ',')}</>;
};

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.25) % 80;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          backgroundPosition: `${drift}px ${drift}px`,
          opacity: 0.35,
          maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 75%)',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 600px at ${50 + Math.sin(frame / 90) * 12}% 55%, rgba(34,200,255,0.13), transparent 70%), radial-gradient(700px 500px at ${30 + Math.cos(frame / 110) * 10}% 30%, rgba(140,255,75,0.08), transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Scene wrapper: fades in/out at the edges. */
export const Scene: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10, dur - 10, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o, fontFamily: FONT, color: C.text}}>{children}</AbsoluteFill>;
};

export const Product: React.FC<{src: string; width: number; at?: number; style?: React.CSSProperties; children?: React.ReactNode}> = ({
  src,
  width,
  at = 0,
  style,
  children,
}) => {
  const p = useIn(at, 22);
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 28) * 6;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        opacity: p,
        transform: `translateY(${(1 - p) * 60 + float}px) scale(${0.92 + p * 0.08})`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '8%',
          right: '8%',
          bottom: '-6%',
          height: '16%',
          background: 'radial-gradient(ellipse at center, rgba(34,200,255,0.35), transparent 70%)',
          filter: 'blur(18px)',
        }}
      />
      <Img src={staticFile(src)} style={{width: '100%', display: 'block', position: 'relative'}} />
      {children}
    </div>
  );
};

export const Eyebrow: React.FC<{children: React.ReactNode; at?: number}> = ({children, at = 0.2}) => (
  <Rise at={at} y={20}>
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 600, letterSpacing: 4, textTransform: 'uppercase', color: C.green}}>
      <span style={{width: 44, height: 3, background: C.green, borderRadius: 2}} />
      {children}
    </div>
  </Rise>
);

export const Title: React.FC<{children: React.ReactNode; at?: number; size?: number}> = ({children, at = 0.35, size = 84}) => (
  <Rise at={at}>
    <div style={{fontSize: size, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, marginTop: 18}}>{children}</div>
  </Rise>
);

export const Footnote: React.FC<{children: React.ReactNode; at?: number}> = ({children, at = 1}) => (
  <Rise at={at} y={10} style={{position: 'absolute', left: 110, right: 110, bottom: 48}}>
    <div style={{fontSize: 22, color: C.dim}}>{children}</div>
  </Rise>
);

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      background: C.panel,
      border: `1px solid ${C.line}`,
      borderRadius: 28,
      padding: '28px 32px',
      ...style,
    }}
  >
    {children}
  </div>
);

const stroke = {fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
export const Icon: React.FC<{name: string; size?: number; color?: string}> = ({name, size = 64, color = C.cyan}) => {
  const paths: Record<string, React.ReactNode> = {
    fridge: (<><rect x="9" y="3" width="14" height="26" rx="3" {...stroke} /><path d="M9 13h14M13 7v3M13 17v5" {...stroke} /></>),
    router: (<><rect x="4" y="19" width="24" height="8" rx="3" {...stroke} /><path d="M9 23h.1M14 23h.1M16 19v-4M10.5 10.5a8 8 0 0 1 11 0M7 7a13 13 0 0 1 18 0" {...stroke} /></>),
    tv: (<><rect x="3" y="6" width="26" height="17" rx="3" {...stroke} /><path d="M11 28h10M16 23v5" {...stroke} /></>),
    kettle: (<><path d="M9 12h13l2 15H7z" {...stroke} /><path d="M11 12V9h9v3M22 15c5 0 5 7 1 7M9 14L4 10" {...stroke} /></>),
    washer: (<><rect x="5" y="3" width="22" height="26" rx="3" {...stroke} /><circle cx="16" cy="18" r="6.5" {...stroke} /><path d="M9 7.5h.1M13 7.5h6" {...stroke} /></>),
    plug: (<><path d="M11 3v7M21 3v7M8 10h16v5a8 8 0 0 1-16 0zM16 23v6" {...stroke} /></>),
    sun: (<><circle cx="16" cy="16" r="5.5" {...stroke} /><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M6.8 25.2l2.8-2.8M22.4 9.6l2.8-2.8" {...stroke} /></>),
    car: (<><path d="M5 18l2.5-7.5A3 3 0 0 1 10.3 8.500h11.400a3 3 0 0 1 2.8 2l2.5 7.500v7h-4v-3H9v3H5z" {...stroke} /><path d="M9.5 18h.1M22.5 18h.1" {...stroke} /></>),
    bolt: (<path d="M18 3L6 18h8l-2 11 13-16h-8z" {...stroke} />),
    usb: (<><rect x="10" y="12" width="12" height="17" rx="3" {...stroke} /><path d="M12 12V4h8v8M15 7.500h.1M17.5 7.500h.1" {...stroke} /></>),
    bt: (<path d="M9 9.500l14 13L16 29V3l7 6.5-14 13" {...stroke} />),
    cycle: (<><path d="M27 16a11 11 0 0 1-19.5 7M5 16a11 11 0 0 1 19.5-7" {...stroke} /><path d="M25 3.500V9.500h-6M7 28.500V22.500h6" {...stroke} /></>),
    weight: (<><path d="M8 11h16l3 17H5z" {...stroke} /><circle cx="16" cy="7" r="3.5" {...stroke} /></>),
    box: (<><path d="M16 3l11 6v14l-11 6-11-6V9z" {...stroke} /><path d="M5 9l11 6 11-6M16 15v14" {...stroke} /></>),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{color, flexShrink: 0}}>
      {paths[name]}
    </svg>
  );
};
