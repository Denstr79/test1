import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, Series, staticFile} from 'remotion';
import {S1, S2, S3, S4, S5, S6, S7, S8, S9} from './scenes';
import {V1, V2, V3, V4, V5, V6, V7, V8, V9} from './scenesVertical';
import {FPS, V, sceneFrames} from './timing';
import {Background, Scene} from './ui';

const TOTAL = sceneFrames.reduce((a, d) => a + d, 0);

const Timeline: React.FC<{scenes: React.FC[]}> = ({scenes}) => (
  <AbsoluteFill>
    <Background />
    <Series>
      {scenes.map((Comp, i) => (
        <Series.Sequence key={i} durationInFrames={sceneFrames[i]}>
          <Scene dur={sceneFrames[i]}>
            <Comp />
          </Scene>
          <Sequence from={Math.round(V * FPS)}>
            <Audio src={staticFile(`vo/s${i + 1}.mp3`)} />
          </Sequence>
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

const Promo: React.FC = () => <Timeline scenes={[S1, S2, S3, S4, S5, S6, S7, S8, S9]} />;
const PromoVertical: React.FC = () => <Timeline scenes={[V1, V2, V3, V4, V5, V6, V7, V8, V9]} />;

export const Root: React.FC = () => (
  <>
    <Composition id="Promo" component={Promo} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
    <Composition id="PromoVertical" component={PromoVertical} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
  </>
);
