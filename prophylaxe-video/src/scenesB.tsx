import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, Card, H1, Pop, Term, cue, useIn, useRamp, useSec} from './ui';

const row: React.CSSProperties = {display: 'flex', gap: 24};

/* 7 — Seven measures (DGZMK) */
const measures = [
  {k: 'm1', t: 'Fluoridzahnpasta', n: '2× täglich · 1000–1500 ppm'},
  {k: 'm2', t: 'Weniger Zuckerimpulse', n: 'Häufigkeit zählt, nicht die Menge'},
  {k: 'm3', t: 'Zuckerfreier Kaugummi', n: 'Speichel neutralisiert Säuren'},
  {k: 'm4', t: 'Individualprophylaxe', n: 'IP-Programm nach Risiko'},
  {k: 'm5', t: 'Fluoridlack', n: 'hochkonzentriert, in der Praxis'},
  {k: 'm6', t: 'Chlorhexidin (CHX)', n: 'nur bei hohem Risiko'},
  {k: 'm7', t: 'Fissurenversiegelung', n: 'schützt die Kauflächen'},
];
const Measure: React.FC<{m: (typeof measures)[number]; i: number; color: string; soft: string}> = ({m, i, color, soft}) => {
  const p = useIn(cue(7, m.k));
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '13px 0', opacity: 0.22 + p * 0.78, translate: `${(1 - p) * 30}px 0`}}>
      <div style={{width: 60, height: 60, borderRadius: 20, background: p > 0.5 ? color : soft, color: p > 0.5 ? '#fff' : color, fontSize: 32, fontWeight: 800, textAlign: 'center', lineHeight: '60px', flexShrink: 0}}>
        {i + 1}
      </div>
      <div>
        <div style={{fontSize: 36, fontWeight: 700, lineHeight: 1.15}}>{m.t}</div>
        <div style={{fontSize: 27, color: C.dim}}>{m.n}</div>
      </div>
    </div>
  );
};
export const Sieben: React.FC = () => (
  <div>
    <H1>
      Kariesprophylaxe: <span style={{color: C.teal}}>7 Maßnahmen</span>
    </H1>
    <Pop at={1.2} style={{marginTop: 10}}>
      <div style={{fontSize: 28, color: C.dim}}>DGZMK · Deutsche Gesellschaft für Zahn-, Mund- und Kieferheilkunde</div>
    </Pop>
    <div style={{...row, marginTop: 22}}>
      <Pop at={6.5} style={{flex: 1}}>
        <Card accent={C.teal} style={{height: 520, padding: '22px 32px'}}>
          <Term size={26}>Zu Hause · Ihre Aufgabe</Term>
          <div style={{marginTop: 14}}>
            {measures.slice(0, 3).map((m, i) => (
              <Measure key={m.k} m={m} i={i} color={C.teal} soft={C.tealSoft} />
            ))}
          </div>
        </Card>
      </Pop>
      <Pop at={cue(7, 'praxis')} style={{flex: 1}}>
        <Card accent={C.blue} style={{height: 520, padding: '22px 32px'}}>
          <Term size={26} color={C.blue} bg="#e3f0ff">
            In der Praxis
          </Term>
          <div style={{marginTop: 14}}>
            {measures.slice(3).map((m, i) => (
              <Measure key={m.k} m={m} i={i + 3} color={C.blue} soft="#e3f0ff" />
            ))}
          </div>
        </Card>
      </Pop>
    </div>
  </div>
);

/* 8 — Professional tooth cleaning */
const steps = [
  {k: 'p1', t: 'Mundspülung', n: 'desinfizierend – senkt die Keimzahl'},
  {k: 'p2', t: 'Zahnstein entfernen', n: 'harte Beläge werden gelöst'},
  {k: 'p3', t: 'Pulverstrahl', n: 'löst Verfärbungen'},
  {k: 'p4', t: 'Politur', n: 'glatte Flächen – Bakterien haften schlechter'},
  {k: 'p5', t: 'Zwischenräume', n: 'Reinigung der Approximalräume'},
  {k: 'p6', t: 'Fluoridierung', n: 'stärkt den Zahnschmelz'},
];
export const Pzr: React.FC = () => {
  const c = (k: string) => cue(8, k);
  const s = useSec();
  let active = -1;
  steps.forEach((x, i) => {
    if (s >= c(x.k)) active = i;
  });
  const ind = s >= c('ind');
  const powder = useIn(c('p3') + 2.6);
  const powder2 = useIn(c('p3') + 6.2);
  return (
    <div>
      <H1>
        PZR <span style={{color: C.dim, fontWeight: 600, fontSize: 44}}>· Professionelle Zahnreinigung</span>
      </H1>
      <div style={{...row, gap: 14, marginTop: 34}}>
        {steps.map((x, i) => {
          const on = i === active && !ind;
          const done = i < active || ind;
          return (
            <Pop key={x.k} at={0.8 + i * 0.12} style={{flex: 1}}>
              <div
                style={{
                  borderRadius: 24,
                  padding: '22px 18px',
                  height: 190,
                  background: on ? C.teal : C.card,
                  color: on ? '#fff' : C.ink,
                  boxShadow: on ? '0 18px 40px rgba(15,181,166,0.35)' : '0 8px 24px rgba(13,43,58,0.06)',
                  scale: on ? '1.06' : '1',
                  opacity: done || on ? 1 : 0.55,
                }}
              >
                <div style={{fontSize: 56, fontWeight: 800, lineHeight: 1, color: on ? '#fff' : done ? C.teal : C.line}}>{done && !on ? '✓' : i + 1}</div>
                <div style={{fontSize: 29, fontWeight: 700, marginTop: 14, lineHeight: 1.15}}>{x.t}</div>
              </div>
            </Pop>
          );
        })}
      </div>
      <div style={{marginTop: 34, height: 330, position: 'relative'}}>
        {active >= 0 && !ind && active !== 2 && (
          <Card style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '30px 48px'}}>
            <div style={{fontSize: 30, fontWeight: 700, color: C.tealDark}}>Schritt {active + 1}</div>
            <div style={{fontSize: 70, fontWeight: 800, letterSpacing: -1}}>{steps[active].t}</div>
            <div style={{fontSize: 38, color: C.dim, marginTop: 6}}>{steps[active].n}</div>
          </Card>
        )}
        {active === 2 && !ind && (
          <div style={{...row, position: 'absolute', inset: 0}}>
            <Card accent={C.amber} style={{flex: 1, opacity: powder, translate: `0 ${(1 - powder) * 30}px`}}>
              <div style={{fontSize: 30, fontWeight: 700, color: C.dim}}>Pulverstrahl</div>
              <div style={{fontSize: 54, fontWeight: 800}}>Natriumbikarbonat</div>
              <div style={{fontSize: 34, color: C.dim, marginTop: 10}}>hartnäckige Verfärbungen auf gesundem Schmelz</div>
            </Card>
            <Card accent={C.teal} style={{flex: 1, opacity: powder2, translate: `0 ${(1 - powder2) * 30}px`}}>
              <div style={{fontSize: 30, fontWeight: 700, color: C.dim}}>Pulverstrahl</div>
              <div style={{fontSize: 54, fontWeight: 800}}>Glycinpulver</div>
              <div style={{fontSize: 34, color: C.dim, marginTop: 10}}>sanft: empfindliche Zahnhälse, unter dem Zahnfleisch</div>
            </Card>
          </div>
        )}
        {ind && (
          <Card accent={C.coral} style={{position: 'absolute', inset: 0, padding: '30px 44px'}}>
            <div style={{fontSize: 44, fontWeight: 800}}>Besonders wichtig bei</div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 30}}>
              {['Parodontitis', 'Schwangerschaft', 'Diabetes', 'Herz-Kreislauf-Erkrankungen'].map((t, i) => (
                <Pop key={t} at={c('ind') + 1.4 + i * 1.25}>
                  <Term color={C.coral} bg={C.coralSoft} size={40}>
                    {t}
                  </Term>
                </Pop>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

/* Cross-section of a molar crown with a fissure. */
const Fissure: React.FC<{seal: number; etched?: number; light?: number; bugs?: number; brush?: number; caries?: number}> = ({seal, etched = 0, light = 0, bugs = 0, brush = 0, caries = 0}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={620} height={500} viewBox="0 0 620 500" style={{overflow: 'visible'}}>
      <defs>
        <clipPath id="groove">
          <path d="M250 96 C285 150 300 240 310 300 C320 240 335 150 370 96 Z" />
        </clipPath>
      </defs>
      <path d="M60 470 C40 300 50 120 150 90 C210 72 240 84 250 96 C285 150 300 240 310 300 C320 240 335 150 370 96 C380 84 410 72 470 90 C570 120 580 300 560 470 Z" fill="#ffffff" />
      <path d="M100 470 C84 320 92 170 160 138 C200 122 222 130 232 146 C262 200 280 300 310 352 C340 300 358 200 388 146 C398 130 420 122 460 138 C528 170 536 320 520 470 Z" fill="#f4d9a8" />
      <path d="M60 470 C40 300 50 120 150 90 C210 72 240 84 250 96 C285 150 300 240 310 300 C320 240 335 150 370 96 C380 84 410 72 470 90 C570 120 580 300 560 470" fill="none" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
      <path d="M250 96 C285 150 300 240 310 300 C320 240 335 150 370 96" fill="none" stroke="#f5f5f0" strokeWidth={30} opacity={etched} />
      <circle cx={310} cy={300} r={26 * caries} fill="#b98a4a" opacity={caries} />
      <g clipPath="url(#groove)">
        <rect x={240} y={300 - seal * 215} width={140} height={230} fill={C.teal} />
      </g>
      {Array.from({length: 9}, (_, i) => (
        <circle key={i} cx={300 + (i % 3) * 10 + Math.sin(frame / 8 + i) * 2} cy={250 - Math.floor(i / 3) * 34 + Math.cos(frame / 9 + i) * 2} r={6} fill={C.violet} opacity={bugs * (1 - seal * 0.75)} />
      ))}
      <g opacity={brush} transform={`translate(${Math.sin(frame / 5) * 14} ${(1 - brush) * -40})`}>
        <rect x={200} y={-40} width={220} height={30} rx={15} fill={C.blue} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={214 + i * 28} y={-10} width={16} height={74} rx={6} fill={C.ink} />
        ))}
      </g>
      <g opacity={light}>
        <path d="M310 -60 L250 80 H370 Z" fill="rgba(47,140,255,0.35)" />
        <circle cx={310} cy={-60} r={22} fill={C.blue} />
      </g>
      <text x={78} y={72} fontSize={26} fontWeight={700} fill={C.dim} fontFamily="Inter">
        Schmelz
      </text>
      <text x={150} y={420} fontSize={26} fontWeight={700} fill="#9a7436" fontFamily="Inter">
        Dentin
      </text>
    </svg>
  );
};

/* 9 — Fissure sealing */
export const Fissur: React.FC = () => {
  const c = (k: string) => cue(9, k);
  const brush = useRamp(c('borst') - 0.3, c('borst') + 0.5) * (1 - useRamp(c('kunst') - 0.4, c('kunst')));
  const bugs = useRamp(c('borst') + 1.6, c('borst') + 2.6);
  const seal = useRamp(c('kunst'), c('kunst') + 2.6);
  return (
    <div style={{...row, height: '100%'}}>
      <div style={{width: 700}}>
        <H1 size={64}>Fissurenversiegelung</H1>
        <div style={{marginTop: 110, marginLeft: 30}}>
          <Fissure seal={seal} bugs={bugs} brush={brush} />
        </div>
      </div>
      <div style={{flex: 1, paddingTop: 10}}>
        <Pop at={1.4}>
          <Card style={{fontSize: 33, lineHeight: 1.3}}>
            <b>Fissuren</b> = tiefe Furchen auf den Kauflächen der Backenzähne
          </Card>
        </Pop>
        <Pop at={c('kunst')} style={{marginTop: 16}}>
          <Card accent={C.teal} style={{fontSize: 33, lineHeight: 1.3}}>
            Dünnfließender <b>Kunststoff</b> verschließt die Schlupfwinkel
          </Card>
        </Pop>
        <Pop at={c('white')} style={{marginTop: 16}}>
          <Card accent={C.amber} style={{fontSize: 33, lineHeight: 1.3}}>
            <b>White Spot</b> = beginnende Karies ohne Loch → versiegeln
            <Pop at={c('arret')} style={{marginTop: 14}}>
              <Term color={C.amber} bg={C.amberSoft} size={36}>
                Kariesarretierung
              </Term>
            </Pop>
          </Card>
        </Pop>
        <Pop at={c('kontra')} style={{marginTop: 16}}>
          <Card accent={C.coral} style={{fontSize: 31, lineHeight: 1.3}}>
            <div style={{fontWeight: 800, color: C.coral, fontSize: 28, marginBottom: 6}}>KONTRAINDIKATION</div>
            <div>✕ Zahn nicht vollständig durchgebrochen</div>
            <Pop at={c('kontra') + 4.2} y={10}>
              <div>✕ Karies hat das Dentin erreicht</div>
            </Pop>
          </Card>
        </Pop>
      </div>
    </div>
  );
};

/* 10 — Sealing procedure */
const seq = [
  {k: 'a1', t: 'Reinigen und trockenlegen', n: 'Watterollen und Sauger – kein Speichel'},
  {k: 'a2', t: 'Anätzen mit Säure', n: 'nach dem Abspülen: kreidig weiß'},
  {k: 'a3', t: 'Versiegler auftragen', n: 'mit Blaulicht aushärten'},
  {k: 'a4', t: 'Kontrolle', n: 'Biss prüfen, polieren, fluoridieren'},
];
export const Ablauf: React.FC = () => {
  const c = (k: string) => cue(10, k);
  const s = useSec();
  const etched = useRamp(c('a2') + 2.6, c('a2') + 4);
  const seal = useRamp(c('a3'), c('a3') + 1.8);
  const light = useRamp(c('a3') + 2, c('a3') + 2.5) * (1 - useRamp(c('a4') - 0.4, c('a4')));
  return (
    <div style={{...row, height: '100%'}}>
      <div style={{flex: 1}}>
        <H1 size={64}>So läuft die Versiegelung ab</H1>
        <div style={{marginTop: 30}}>
          {seq.map((x, i) => {
            const on = s >= c(x.k) && (i === seq.length - 1 || s < c(seq[i + 1].k));
            return (
              <Pop key={x.k} at={c(x.k)} x={-40} y={0}>
                <div style={{display: 'flex', alignItems: 'center', gap: 24, background: on ? C.teal : C.card, color: on ? '#fff' : C.ink, borderRadius: 26, padding: '20px 28px', marginBottom: 16, boxShadow: '0 10px 30px rgba(13,43,58,0.07)'}}>
                  <div style={{fontSize: 60, fontWeight: 800, width: 60, textAlign: 'center', color: on ? '#fff' : C.teal}}>{i + 1}</div>
                  <div>
                    <div style={{fontSize: 40, fontWeight: 800}}>{x.t}</div>
                    <div style={{fontSize: 29, opacity: 0.8}}>{x.n}</div>
                  </div>
                </div>
              </Pop>
            );
          })}
        </div>
      </div>
      <div style={{width: 680, paddingTop: 170, paddingLeft: 40}}>
        <Fissure seal={seal} etched={etched * (1 - seal)} light={light} />
      </div>
    </div>
  );
};

/* 11 — Summary */
export const Fazit: React.FC = () => {
  const c = (k: string) => cue(11, k);
  const points = [
    {k: 'k1', t: 'Risiko messen', n: 'API und PBI'},
    {k: 'k2', t: 'Mundhygiene zu Hause', n: 'Technik, Fluorid, Zwischenräume'},
    {k: 'k3', t: 'Prophylaxe in der Praxis', n: 'PZR · Fluoridierung · Fissurenversiegelung'},
  ];
  const end = useIn(c('erfolg'));
  return (
    <div style={{textAlign: 'center', paddingTop: 70}}>
      <Pop at={0.2}>
        <Term size={28}>Zusammenfassung</Term>
      </Pop>
      <H1 at={LEAD_HEAD} size={92}>
        Risiken managen <span style={{color: C.coral, textDecoration: 'line-through'}}>statt reparieren</span>
      </H1>
      <div style={{...row, marginTop: 40, textAlign: 'left'}}>
        {points.map((p, i) => (
          <Pop key={p.k} at={c(p.k)} style={{flex: 1}}>
            <Card accent={C.teal} style={{height: 210}}>
              <div style={{fontSize: 30, fontWeight: 800, color: C.teal}}>✓ {i + 1}</div>
              <div style={{fontSize: 40, fontWeight: 800, marginTop: 6}}>{p.t}</div>
              <div style={{fontSize: 28, color: C.dim, marginTop: 6}}>{p.n}</div>
            </Card>
          </Pop>
        ))}
      </div>
      <Pop at={c('partner')} style={{marginTop: 34}}>
        <div style={{fontSize: 46, fontWeight: 700}}>
          <span style={{color: C.dim}}>passiver Patient</span> <span style={{color: C.teal}}>→</span> aktiver Partner
        </div>
      </Pop>
      <div style={{marginTop: 26, opacity: end, scale: String(0.9 + end * 0.1)}}>
        <span style={{display: 'inline-block', background: C.teal, color: '#fff', fontSize: 44, fontWeight: 800, padding: '18px 44px', borderRadius: 999}}>Viel Erfolg bei Ihrer Fachsprachprüfung!</span>
      </div>
    </div>
  );
};
const LEAD_HEAD = 2.2;
