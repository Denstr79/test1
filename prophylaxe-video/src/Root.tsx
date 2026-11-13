import React from 'react';
import {Audio, Composition, Sequence, Series, staticFile} from 'remotion';
import {Biofilm, Hygiene, Indizes, Intro, Stufen, Verlust} from './scenesA';
import {Ablauf, Fazit, Fissur, Pzr, Sieben} from './scenesB';
import {FPS, LEAD, Shell, TOTAL, sceneFrames} from './ui';

const list: React.FC[] = [Intro, Stufen, Biofilm, Verlust, Indizes, Hygiene, Sieben, Pzr, Fissur, Ablauf, Fazit];

const Prophylaxe: React.FC = () => (
  <Series>
    {list.map((Comp, i) => (
      <Series.Sequence key={i} durationInFrames={sceneFrames[i]}>
        <Shell n={i + 1}>
          <Comp />
        </Shell>
        <Sequence from={Math.round(LEAD * FPS)}>
          <Audio src={staticFile(`vo/${i + 1}.mp3`)} />
        </Sequence>
      </Series.Sequence>
    ))}
  </Series>
);

export const Root: React.FC = () => <Composition id="Prophylaxe" component={Prophylaxe} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />;
