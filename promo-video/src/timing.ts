import T from './timing.json';

export const FPS = 30;
/** Voice-over starts this many seconds into every scene. */
export const V = 0.2;
/** Time (s, relative to voice-over start) at which a cue word is spoken in scene `n` (1-based). */
export const c = (n: number, key: string): number => (T[n - 1].cues as unknown as Record<string, number>)[key] ?? 0;
/** Scene lengths in frames: voice-over + small padding; the outro holds a little longer. */
export const sceneFrames = T.map((t, i) => Math.ceil((t.dur + (i === T.length - 1 ? 0.9 : 0.35)) * FPS));
