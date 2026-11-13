import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, Card, H1, Pop, Term, Tooth, cue, useIn, useRamp, useSec} from './ui';

const row: React.CSSProperties = {display: 'flex', gap: 28};

/* 1 — Intro */
export const Intro: React.FC = () => {
  const c = (k: string) => cue(1, k);
  const shield = useIn(3.6);
  const topics = [
    {k: 'stufen', t: '3 Stufen der Prävention'},
    {k: 'pzr', t: 'Professionelle Zahnreinigung'},
    {k: 'fluor', t: 'Fluoridierung'},
    {k: 'fiss', t: 'Fissurenversiegelung'},
  ];
  return (
    <div style={{...row, height: '100%', alignItems: 'center'}}>
      <div style={{flex: 1}}>
        <Pop at={0.1} y={20}>
          <Term size={26}>Fachsprachprüfung · Episode 8</Term>
        </Pop>
        <H1 at={0.25} size={150}>
          Prophylaxe
        </H1>
        <Pop at={0.9}>
          <div style={{fontSize: 46, color: C.dim, marginTop: 8}}>
            mehr als <span style={{textDecoration: 'line-through', textDecorationColor: C.coral}}>Zähne polieren</span>
          </div>
        </Pop>
        <div style={{display: 'flex', gap: 16, marginTop: 34}}>
          <Pop at={c('gegner')}>
            <Term color={C.coral} bg={C.coralSoft} size={32}>
              Karies
            </Term>
          </Pop>
          <Pop at={c('gegner') + 0.9}>
            <Term color={C.coral} bg={C.coralSoft} size={32}>
              Parodontitis
            </Term>
          </Pop>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 44, maxWidth: 980}}>
          {topics.map((x, i) => (
            <Pop key={x.k} at={c(x.k)}>
              <Card style={{padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 18}}>
                <div style={{width: 46, height: 46, borderRadius: 14, background: C.tealSoft, color: C.tealDark, fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {i + 1}
                </div>
                <div style={{fontSize: 30, fontWeight: 700}}>{x.t}</div>
              </Card>
            </Pop>
          ))}
        </div>
      </div>
      <div style={{width: 560, height: 640, position: 'relative'}}>
        <Pop at={0.4} scale={0.7} style={{position: 'absolute', left: 110, top: 60}}>
          <Tooth size={340} />
        </Pop>
        <svg width={560} height={640} style={{position: 'absolute', left: 0, top: 0, opacity: shield, scale: String(0.8 + shield * 0.2)}}>
          <path d="M280 40 L480 110 V320 C480 460 390 560 280 610 C170 560 80 460 80 320 V110 Z" fill="rgba(15,181,166,0.10)" stroke={C.teal} strokeWidth={10} strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

/* 2 — Three levels of prevention */
const levels = [
  {k: 'prim', name: 'Primäre Prävention', verb: 'verhindern', color: C.teal, soft: C.tealSoft, items: ['zuckerarme Ernährung', 'gründliche Mundhygiene', 'Fluoride']},
  {k: 'sek', name: 'Sekundäre Prävention', verb: 'früh erkennen', color: C.amber, soft: C.amberSoft, items: ['regelmäßige Kontrollen', 'professionelle Zahnreinigung', 'Fissurenversiegelung']},
  {k: 'tert', name: 'Tertiäre Prävention', verb: 'reparieren', color: C.coral, soft: C.coralSoft, items: ['Füllungen', 'Kronen', 'Zahnersatz']},
];
const Level: React.FC<{l: (typeof levels)[number]; i: number}> = ({l, i}) => {
  const at = cue(2, l.k);
  const p = useIn(at);
  const goal = useIn(cue(2, 'ziel'));
  const fade = i === 2 ? 1 - goal * 0.55 : 1;
  return (
    <Card accent={l.color} style={{flex: 1, opacity: (0.25 + p * 0.75) * fade, translate: `0 ${(1 - p) * 40}px`, padding: '34px 38px', minHeight: 520}}>
      <div style={{fontSize: 96, fontWeight: 800, color: l.color, lineHeight: 1}}>{i + 1}</div>
      <div style={{fontSize: 40, fontWeight: 800, marginTop: 10}}>{l.name}</div>
      <div style={{marginTop: 14}}>
        <Term color={l.color === C.teal ? C.tealDark : l.color} bg={l.soft} size={28}>
          {l.verb}
        </Term>
      </div>
      <div style={{marginTop: 26}}>
        {l.items.map((t, j) => (
          <Pop key={t} at={at + 3.4 + j * 1.3} y={14}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 35, marginBottom: 18}}>
              <span style={{width: 14, height: 14, borderRadius: 7, background: l.color, flexShrink: 0}} />
              {t}
            </div>
          </Pop>
        ))}
      </div>
    </Card>
  );
};
export const Stufen: React.FC = () => (
  <div>
    <H1>Drei Verteidigungslinien</H1>
    <div style={{...row, marginTop: 34}}>
      {levels.map((l, i) => (
        <Level key={l.k} l={l} i={i} />
      ))}
    </div>
    <Pop at={cue(2, 'ziel')} style={{marginTop: 26, textAlign: 'center'}}>
      <Term size={34}>Ziel: die dritte Linie nie erreichen</Term>
    </Pop>
  </div>
);

/* 3 — Biofilm */
const bugs = Array.from({length: 26}, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  return {x: 100 + Math.cos(a) * (18 + (i % 5) * 9), y: 52 + Math.sin(a) * 16 - (i % 3) * 4, r: 5 + (i % 3) * 2, d: i * 0.12};
});
export const Biofilm: React.FC = () => {
  const c = (k: string) => cue(3, k);
  const s = useSec();
  const frame = useCurrentFrame();
  const acid = useRamp(c('saeure'), c('saeure') + 2.5);
  return (
    <div style={{...row, height: '100%', alignItems: 'center'}}>
      <div style={{width: 640, position: 'relative', height: 620}}>
        <Tooth size={420} style={{position: 'absolute', left: 110, top: 40}}>
          {bugs.map((b, i) => {
            const on = s > c('bakt') + b.d;
            return on ? (
              <circle key={i} cx={b.x + Math.sin(frame / 9 + i) * 1.5} cy={b.y + Math.cos(frame / 11 + i) * 1.5} r={b.r} fill={i % 2 ? C.violet : '#a48cff'} opacity={0.9} />
            ) : null;
          })}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} opacity={acid > 0 ? 1 - ((acid * 1.6 + i * 0.25) % 1) : 0}>
              <circle cx={62 + i * 26} cy={88 - ((acid * 1.6 + i * 0.25) % 1) * 90} r={7} fill={C.blue} />
            </g>
          ))}
        </Tooth>
        <Pop at={c('saeure')} style={{position: 'absolute', left: 30, top: 20}}>
          <Term color={C.blue} bg="#e3f0ff" size={26}>
            Ca²⁺ · PO₄³⁻
          </Term>
        </Pop>
      </div>
      <div style={{flex: 1}}>
        <H1 size={64}>Der Gegner</H1>
        <Pop at={0.6} style={{marginTop: 20}}>
          <div style={{fontSize: 84, fontWeight: 800, color: C.violet, letterSpacing: -2}}>Plaque</div>
        </Pop>
        <Pop at={c('biofilm')}>
          <div style={{fontSize: 50, fontWeight: 700}}>= oraler Biofilm</div>
        </Pop>
        <Pop at={c('bakt')} style={{marginTop: 26}}>
          <Card style={{fontSize: 34, lineHeight: 1.35}}>
            <span style={{color: C.dim, textDecoration: 'line-through'}}>lose Essensreste</span>
            <br />
            fest organisierte <b>Bakteriengemeinschaft</b>
          </Card>
        </Pop>
        <Pop at={c('saeure')} style={{marginTop: 18}}>
          <Card style={{fontSize: 34}}>
            Säuren entziehen dem <b>Zahnschmelz</b> Mineralien
          </Card>
        </Pop>
        <Pop at={c('demin')} style={{marginTop: 22}}>
          <Term color={C.coral} bg={C.coralSoft} size={44}>
            Demineralisation
          </Term>
        </Pop>
      </div>
    </div>
  );
};

/* 4 — Abrasion / Erosion / Attrition */
const losses = [
  {k: 'abr', name: 'Abrasion', kind: 'mechanisch', color: C.amber, soft: C.amberSoft, text: 'Verschleiß von außen', ex: 'zu festes Putzen, grobe Zahnpasta'},
  {k: 'ero', name: 'Erosion', kind: 'chemisch', color: C.blue, soft: '#e3f0ff', text: 'Säure löst den Schmelz', ex: 'Magensäure (Reflux), Cola'},
  {k: 'att', name: 'Attrition', kind: 'Zahn auf Zahn', color: C.coral, soft: C.coralSoft, text: 'Abrieb durch Zahnkontakt', ex: 'Knirschen = Bruxismus'},
];
const LossIcon: React.FC<{k: string; color: string}> = ({k, color}) => {
  const frame = useCurrentFrame();
  const w = Math.sin(frame / 4) * 10;
  return (
    <svg width={220} height={170} viewBox="0 0 220 170">
      {k === 'abr' && (
        <g>
          <path d="M70 60 C68 34 96 26 110 42 C124 26 152 34 150 60 C153 96 143 112 140 150 H80 C77 112 67 96 70 60 Z" fill="#fff" stroke={C.ink} strokeWidth={6} />
          <g transform={`translate(${w} 0)`}>
            <rect x={20} y={84} width={120} height={18} rx={9} fill={color} />
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={30 + i * 14} y={102} width={8} height={20} rx={3} fill={C.ink} />
            ))}
          </g>
        </g>
      )}
      {k === 'ero' && (
        <g>
          <path d="M70 80 C68 54 96 46 110 62 C124 46 152 54 150 80 C153 116 143 132 140 160 H80 C77 132 67 116 70 80 Z" fill="#fff" stroke={C.ink} strokeWidth={6} />
          {[0, 1, 2].map((i) => {
            const t = (frame / 34 + i / 3) % 1;
            return <path key={i} d="M0 -14 C10 0 10 10 0 14 C-10 10 -10 0 0 -14 Z" transform={`translate(${82 + i * 28} ${t * 46})`} fill={color} opacity={1 - t} />;
          })}
        </g>
      )}
      {k === 'att' && (
        <g>
          <path d="M60 20 H160 C160 50 150 70 110 72 C70 70 60 50 60 20 Z" fill="#fff" stroke={C.ink} strokeWidth={6} transform={`translate(${w} 0)`} />
          <path d="M60 150 H160 C160 120 150 100 110 98 C70 100 60 120 60 150 Z" fill="#fff" stroke={C.ink} strokeWidth={6} transform={`translate(${-w} 0)`} />
          <path d="M70 85 H150" stroke={color} strokeWidth={6} strokeDasharray="6 10" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
export const Verlust: React.FC = () => (
  <div>
    <H1>Zahnhartsubstanzverlust ohne Bakterien</H1>
    <div style={{...row, marginTop: 70}}>
      {losses.map((l) => (
        <Pop key={l.k} at={cue(4, l.k)} style={{flex: 1}}>
          <Card accent={l.color} style={{textAlign: 'center', padding: '34px 30px 38px'}}>
            <LossIcon k={l.k} color={l.color} />
            <div style={{fontSize: 62, fontWeight: 800, marginTop: 8}}>{l.name}</div>
            <div style={{marginTop: 12}}>
              <Term color={l.color} bg={l.soft} size={28}>
                {l.kind}
              </Term>
            </div>
            <div style={{fontSize: 32, marginTop: 22, fontWeight: 600}}>{l.text}</div>
            <div style={{fontSize: 28, marginTop: 8, color: C.dim}}>{l.ex}</div>
          </Card>
        </Pop>
      ))}
    </div>
  </div>
);

/* 5 — Indices */
export const Indizes: React.FC = () => {
  const c = (k: string) => cue(5, k);
  const s = useSec();
  const flash = Math.max(0, 1 - Math.abs(s - c('blitz') - 0.9) * 3);
  const ekg = useRamp(c('ekg'), c('ekg') + 3);
  const stain = useRamp(c('farb'), c('farb') + 2.5);
  const flags = [false, true, false, true, true, false];
  return (
    <div>
      <H1>Risiko erkennen mit zwei Indizes</H1>
      <div style={{...row, marginTop: 30}}>
        <Pop at={c('api')} style={{flex: 1}}>
          <Card accent={C.violet} style={{position: 'relative', overflow: 'hidden', height: 420}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
              <span style={{fontSize: 96, fontWeight: 800, color: C.violet, lineHeight: 1}}>API</span>
              <span style={{fontSize: 30, fontWeight: 600, color: C.dim}}>Approximalraum-Plaque-Index</span>
            </div>
            <div style={{fontSize: 32, marginTop: 14}}>Plaque im Zahnzwischenraum: ja oder nein?</div>
            <div style={{display: 'flex', gap: 6, marginTop: 26, alignItems: 'flex-end'}}>
              {flags.map((f, i) => (
                <React.Fragment key={i}>
                  <div style={{width: 74, height: 96, borderRadius: '26px 26px 14px 14px', background: '#fff', border: `5px solid ${C.ink}`}} />
                  {i < flags.length - 1 && (
                    <Pop at={c('api') + 3 + i * 0.5} y={-10}>
                      <div style={{width: 30, height: 30, borderRadius: 15, background: f ? C.violet : C.line, color: '#fff', fontSize: 20, fontWeight: 800, textAlign: 'center', lineHeight: '30px', marginBottom: 34}}>
                        {f ? '+' : '–'}
                      </div>
                    </Pop>
                  )}
                </React.Fragment>
              ))}
            </div>
            <Pop at={c('blitz')} style={{position: 'absolute', left: 32, bottom: 26}}>
              <Term color={C.violet} bg={C.violetSoft} size={28}>
                Momentaufnahme · „Blitzerfoto“
              </Term>
            </Pop>
            <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash * 0.9}} />
          </Card>
        </Pop>
        <Pop at={c('pbi')} style={{flex: 1}}>
          <Card accent={C.coral} style={{position: 'relative', height: 420}}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
              <span style={{fontSize: 96, fontWeight: 800, color: C.coral, lineHeight: 1}}>PBI</span>
              <span style={{fontSize: 30, fontWeight: 600, color: C.dim}}>Papillen-Blutungs-Index</span>
            </div>
            <div style={{fontSize: 32, marginTop: 14}}>Blutungsneigung des Zahnfleischs</div>
            <svg width={760} height={120} viewBox="0 0 760 120" style={{marginTop: 20}}>
              <path
                d="M0 70 H120 L140 40 L160 100 L180 20 L200 70 H330 L350 40 L370 100 L390 20 L410 70 H540 L560 40 L580 100 L600 20 L620 70 H760"
                fill="none"
                stroke={C.coral}
                strokeWidth={6}
                strokeLinejoin="round"
                strokeDasharray={1400}
                strokeDashoffset={1400 * (1 - ekg)}
              />
            </svg>
            <Pop at={c('ekg')} style={{position: 'absolute', left: 32, bottom: 26}}>
              <Term color={C.coral} bg={C.coralSoft} size={28}>
                chronische Entzündung · „Langzeit-EKG“
              </Term>
            </Pop>
          </Card>
        </Pop>
      </div>
      <Pop at={c('farb')} style={{marginTop: 24}}>
        <Card style={{display: 'flex', alignItems: 'center', gap: 30, padding: '20px 32px'}}>
          <div style={{fontSize: 34, fontWeight: 700}}>Beläge anfärben</div>
          <div style={{display: 'flex', gap: 8}}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{width: 54, height: 66, borderRadius: '18px 18px 10px 10px', border: `4px solid ${C.ink}`, background: `linear-gradient(0deg, rgba(123,92,255,${stain * (0.35 + (i % 3) * 0.25)}) ${30 + (i % 4) * 14}%, #fff ${45 + (i % 4) * 14}%)`}} />
            ))}
          </div>
          <div style={{fontSize: 30, color: C.dim}}>zeigt, wo die Bürste nicht hinkommt → Motivation</div>
        </Card>
      </Pop>
    </div>
  );
};

/* 6 — Oral hygiene at home */
export const Hygiene: React.FC = () => {
  const c = (k: string) => cue(6, k);
  const frame = useCurrentFrame();
  const wig = Math.sin(frame / 2.2) * 5;
  const inter = [
    {k: 'idb', name: 'Interdentalbürste', note: 'erste Wahl, wo sie passt'},
    {k: 'seide', name: 'Zahnseide', note: 'sehr enge Kontaktpunkte'},
    {k: 'super', name: 'Superfloss', note: 'Brücken und Zahnspangen'},
  ];
  return (
    <div>
      <H1>Die richtige Technik zu Hause</H1>
      <div style={{...row, marginTop: 30, alignItems: 'stretch'}}>
        <Pop at={c('bass')} style={{flex: 1}}>
          <Card accent={C.teal} style={{height: 560}}>
            <div style={{fontSize: 44, fontWeight: 800}}>Bass-Technik</div>
            <svg width={480} height={300} viewBox="0 0 480 300" style={{marginTop: 10}}>
              <path d="M0 210 C90 190 150 200 200 180 V300 H0 Z" fill="#ffb3ad" />
              <path d="M150 70 C150 30 250 30 250 80 C252 130 240 170 236 230 H164 C160 170 148 130 150 70 Z" fill="#fff" stroke={C.ink} strokeWidth={7} />
              <g transform={`translate(${wig} ${wig * 0.4}) rotate(-45 300 150)`}>
                <rect x={250} y={130} width={200} height={26} rx={13} fill={C.teal} />
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <rect key={i} x={258 + i * 13} y={156} width={8} height={34} rx={3} fill={C.ink} />
                ))}
              </g>
              <path d="M300 250 A60 60 0 0 0 342 215" fill="none" stroke={C.dim} strokeWidth={4} strokeDasharray="6 8" />
              <text x={352} y={262} fontSize={40} fontWeight={800} fill={C.tealDark} fontFamily="Inter">
                45°
              </text>
            </svg>
            <div style={{fontSize: 30, color: C.dim, lineHeight: 1.3}}>schräg am Zahnfleischsaum ansetzen, sanft rütteln</div>
          </Card>
        </Pop>
        <Pop at={c('elek')} style={{flex: 1}}>
          <Card accent={C.blue} style={{height: 560}}>
            <div style={{fontSize: 44, fontWeight: 800}}>Elektrische Zahnbürste</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 40}}>
              <svg width={120} height={120} viewBox="0 0 120 120">
                <g transform={`rotate(${Math.sin(frame / 3) * 40} 60 60)`}>
                  <circle cx={60} cy={60} r={46} fill="#fff" stroke={C.blue} strokeWidth={8} />
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <circle key={i} cx={60 + Math.cos(i) * 24} cy={60 + Math.sin(i) * 24} r={7} fill={C.ink} />
                  ))}
                </g>
              </svg>
              <div>
                <div style={{fontSize: 34, fontWeight: 700}}>oszillierend-rotierend</div>
                <div style={{fontSize: 28, color: C.dim}}>runder Bürstenkopf</div>
              </div>
            </div>
            <Pop at={c('elek') + 6.6}>
              <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 44}}>
                <svg width={120} height={120} viewBox="0 0 120 120">
                  <rect x={38 + Math.sin(frame * 1.7) * 3} y={12} width={44} height={96} rx={20} fill="#fff" stroke={C.blue} strokeWidth={8} />
                  {[0, 1, 2].map((i) => (
                    <path key={i} d={`M${6 + i * 8} 40 Q${0 + i * 8} 60 ${6 + i * 8} 80`} fill="none" stroke={C.blue} strokeWidth={4} opacity={0.3 + ((frame / 6 + i) % 3) * 0.2} />
                  ))}
                </svg>
                <div>
                  <div style={{fontSize: 34, fontWeight: 700}}>Schallzahnbürste</div>
                  <div style={{fontSize: 28, color: C.dim}}>sehr schnelle Schwingungen</div>
                </div>
              </div>
            </Pop>
          </Card>
        </Pop>
        <div style={{flex: 1}}>
          <Card accent={C.violet} style={{height: 560}}>
            <div style={{fontSize: 44, fontWeight: 800}}>Zahnzwischenräume</div>
            <div style={{marginTop: 26}}>
              {inter.map((x, i) => (
                <Pop key={x.k} at={c(x.k)} x={40} y={0}>
                  <div style={{display: 'flex', gap: 20, alignItems: 'center', padding: '18px 0', borderBottom: i < 2 ? `2px solid ${C.line}` : 'none'}}>
                    <div style={{width: 56, height: 56, borderRadius: 18, background: C.violetSoft, color: C.violet, fontSize: 30, fontWeight: 800, textAlign: 'center', lineHeight: '56px', flexShrink: 0}}>{i + 1}</div>
                    <div>
                      <div style={{fontSize: 36, fontWeight: 700}}>{x.name}</div>
                      <div style={{fontSize: 28, color: C.dim}}>{x.note}</div>
                    </div>
                  </div>
                </Pop>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
