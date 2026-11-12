import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, Series, staticFile} from 'remotion';
import {Background, Scene} from './ui';
import {S1, S2, S3, S4, S5, S6, S7, S8, S9} from './scenes';

const FPS = 30;
// Scene length in frames = voice-over length + lead-in/out padding.
const scenes: [React.FC, number][] = [
  [S1, 282],
  [S2, 377],
  [S3, 396],
  [S4, 281],
  [S5, 255],
  [S6, 296],
  [S7, 279],
  [S8, 251],
  [S9, 210],
];
const TOTAL = scenes.reduce((a, [, d]) => a + d, 0);

const Promo: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Series>
      {scenes.map(([Comp, dur], i) => (
        <Series.Sequence key={i} durationInFrames={dur}>
          <Scene dur={dur}>
            <Comp />
          </Scene>
          <Sequence from={9}>
            <Audio src={staticFile(`vo/s${i + 1}.mp3`)} />
          </Sequence>
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

export const Root: React.FC = () => (
  <Composition id="Promo" component={Promo} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
);
