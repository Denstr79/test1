import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {c, V} from './timing';
import {C, Card, Counter, Eyebrow, Footnote, Icon, Product, Rise, Title, useIn, useSec} from './ui';


const pad: React.CSSProperties = {padding: '90px 110px'};

/* 1 — Hook */
export const S1: React.FC = () => {
  const s = useSec();
  const hook = interpolate(s, [V + c(1, 'brand') - 0.25, V + c(1, 'brand') + 0.1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dark = interpolate(s, [0, V + c(1, 'life'), V + c(1, 'life') + 0.3], [1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#000', opacity: dark}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: hook}}>
        <Rise at={0.15}>
          <div style={{fontSize: 130, fontWeight: 800, letterSpacing: -4, color: '#5b6472'}}>Світло зникло?</div>
        </Rise>
        <Rise at={V + c(1, 'life')}>
          <div style={{fontSize: 130, fontWeight: 800, letterSpacing: -4, color: C.green, textShadow: '0 0 60px rgba(140,255,75,0.5)'}}>
            Життя — ні.
          </div>
        </Rise>
      </AbsoluteFill>
      <Product src="img/angle.png" width={1180} at={V + c(1, 'brand') + 0.1} style={{left: 370, top: 300}} />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 70}}>
        <Rise at={V + c(1, 'brand') + 0.2} y={-30}>
          <div style={{fontSize: 30, fontWeight: 600, letterSpacing: 10, color: C.dim, textAlign: 'center'}}>ALLPOWERS</div>
          <div style={{fontSize: 120, fontWeight: 800, letterSpacing: -4, lineHeight: 1}}>
            S2000 <span style={{color: C.green}}>Pro</span>
          </div>
        </Rise>
        <Rise at={V + c(1, 'brand') + 1.9} y={20}>
          <div style={{fontSize: 36, color: C.dim, marginTop: 14}}>Портативна електростанція для вашого дому</div>
        </Rise>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 2 — Capacity & power */
export const S2: React.FC = () => {
  const peak = useIn(V + c(2, 'w') + 2);
  return (
    <AbsoluteFill style={pad}>
      <Product src="img/front.png" width={900} at={0.1} style={{left: 60, top: 330}} />
      <div style={{marginLeft: 900}}>
        <Eyebrow>Ємність і потужність</Eyebrow>
        <Rise at={V + 0.1}>
          <div style={{fontSize: 190, fontWeight: 800, letterSpacing: -8, lineHeight: 1, marginTop: 30}}>
            <Counter to={1451} at={V + 0.1} dur={1.8} />
            <span style={{fontSize: 64, color: C.cyan, letterSpacing: 0, marginLeft: 16}}>Вт·год</span>
          </div>
          <div style={{fontSize: 30, color: C.dim}}>ємність акумулятора</div>
        </Rise>
        <Rise at={V + c(2, 'w')}>
          <div style={{fontSize: 190, fontWeight: 800, letterSpacing: -8, lineHeight: 1, marginTop: 40}}>
            <Counter to={2400} at={V + c(2, 'w')} dur={1.4} />
            <span style={{fontSize: 64, color: C.green, letterSpacing: 0, marginLeft: 16}}>Вт</span>
          </div>
          <div style={{fontSize: 30, color: C.dim}}>чиста синусоїда, 4 розетки 220–240 В</div>
        </Rise>
        <div style={{marginTop: 44, opacity: peak}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 600}}>
            <span>Пікове навантаження</span>
            <span style={{color: C.green}}>до 4000 Вт</span>
          </div>
          <div style={{height: 16, borderRadius: 8, background: C.line, marginTop: 14, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${peak * 100}%`, borderRadius: 8, background: `linear-gradient(90deg, ${C.cyan}, ${C.green})`}} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 3 — Runtimes */
export const runs = [
  {icon: 'fridge', name: 'Холодильник', val: '≈ 20', unit: 'годин', at: c(3, 'fridge'), bar: 0.6},
  {icon: 'router', name: 'Wi-Fi роутер', val: '100+', unit: 'годин', at: c(3, 'router'), bar: 1},
  {icon: 'tv', name: 'Телевізор', val: '≈ 12', unit: 'годин', at: c(3, 'tv'), bar: 0.45},
  {icon: 'kettle', name: 'Електрочайник', val: '≈ 8', unit: 'закипань', at: c(3, 'kettle'), bar: 0.35},
  {icon: 'washer', name: 'Пральна машина', val: '1–2', unit: 'прання', at: c(3, 'washer'), bar: 0.25},
];
const RunCard: React.FC<{r: (typeof runs)[number]}> = ({r}) => {
  const p = useIn(V + r.at);
  const bar = useIn(V + r.at + 0.25, 30);
  return (
    <Card style={{flex: 1, opacity: 0.25 + p * 0.75, transform: `translateY(${(1 - p) * 50}px)`, borderColor: p > 0.5 ? 'rgba(34,200,255,0.35)' : C.line}}>
      <Icon name={r.icon} size={84} />
      <div style={{fontSize: 27, fontWeight: 600, marginTop: 22, color: C.dim, whiteSpace: 'nowrap'}}>{r.name}</div>
      <div style={{fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 1.1, marginTop: 8, opacity: p}}>{r.val}</div>
      <div style={{fontSize: 30, color: C.green, fontWeight: 600, opacity: p}}>{r.unit}</div>
      <div style={{height: 8, borderRadius: 4, background: C.line, marginTop: 26, overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${bar * r.bar * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.green})`}} />
      </div>
    </Card>
  );
};
export const S3: React.FC = () => (
  <AbsoluteFill style={pad}>
    <Eyebrow at={0}>На одному заряді</Eyebrow>
    <Title at={0.1}>Скільки працює ваша техніка</Title>
    <div style={{display: 'flex', gap: 24, marginTop: 70}}>
      {runs.map((r) => (
        <RunCard key={r.name} r={r} />
      ))}
    </div>
    <Footnote at={0.6}>
      * Орієнтовний розрахунок при ~85% ККД: холодильник ≈ 60 Вт у середньому, роутер ≈ 10 Вт, телевізор ≈ 100 Вт, чайник 2000 Вт (1,5 л), прання ≈ 0,6–0,9 кВт·год.
    </Footnote>
  </AbsoluteFill>
);

/* 4 — Ports */
const IMG_W = 1040;
const k = IMG_W / 1673;
export const ports = [
  {icon: 'plug', title: '4 × розетки', sub: '220–240 В · 2400 Вт', at: c(4, 'ac'), box: [392, 160, 790, 160]},
  {icon: 'usb', title: '2 × USB-C', sub: 'по 100 Вт', at: c(4, 'usbc'), box: [405, 495, 160, 68]},
  {icon: 'usb', title: '4 × USB-A', sub: 'до 18 Вт, швидка зарядка', at: c(4, 'usba'), box: [405, 565, 160, 110]},
  {icon: 'car', title: 'Автовихід', sub: '12 В · 120 Вт', at: c(4, 'car'), box: [398, 360, 160, 100]},
];
const Ring: React.FC<{p: (typeof ports)[number]}> = ({p}) => {
  const a = useIn(V + p.at);
  const frame = useCurrentFrame();
  const [x, y, w, h] = p.box;
  return (
    <div
      style={{
        position: 'absolute',
        left: x * k - 8,
        top: y * k - 8,
        width: w * k + 16,
        height: h * k + 16,
        borderRadius: 18,
        border: `3px solid ${C.green}`,
        boxShadow: `0 0 ${18 + Math.sin(frame / 6) * 8}px rgba(140,255,75,0.7)`,
        opacity: a,
        transform: `scale(${1.25 - a * 0.25})`,
      }}
    />
  );
};
const PortRow: React.FC<{p: (typeof ports)[number]}> = ({p}) => (
  <Rise at={V + p.at} x={60} y={0}>
    <Card style={{display: 'flex', alignItems: 'center', gap: 26, marginBottom: 18, padding: '22px 30px'}}>
      <Icon name={p.icon} size={62} color={C.green} />
      <div>
        <div style={{fontSize: 44, fontWeight: 700}}>{p.title}</div>
        <div style={{fontSize: 28, color: C.dim}}>{p.sub}</div>
      </div>
    </Card>
  </Rise>
);
export const S4: React.FC = () => (
  <AbsoluteFill style={pad}>
    <Eyebrow at={0}>Підключення</Eyebrow>
    <Product src="img/front.png" width={IMG_W} style={{left: 70, top: 300}}>
      {ports.map((p) => (
        <Ring key={p.title} p={p} />
      ))}
    </Product>
    <div style={{position: 'absolute', right: 110, top: 190, width: 640}}>
      {ports.map((p) => (
        <PortRow key={p.title} p={p} />
      ))}
      <Rise at={V + c(4, 'total')}>
        <div style={{marginTop: 26, display: 'flex', alignItems: 'baseline', gap: 22}}>
          <span style={{fontSize: 150, fontWeight: 800, letterSpacing: -6, color: C.green, lineHeight: 1}}>11</span>
          <span style={{fontSize: 40, fontWeight: 600, lineHeight: 1.15}}>
            пристроїв
            <br />
            одночасно
          </span>
        </div>
      </Rise>
    </div>
  </AbsoluteFill>
);

/* 5 — Charging */
export const charge = [
  {icon: 'plug', title: 'Розетка', sub: 'до 1500 Вт', at: c(5, 'wall')},
  {icon: 'sun', title: 'Сонячні панелі', sub: 'до 1000 Вт, MPPT', at: c(5, 'solar')},
  {icon: 'car', title: 'Автомобіль', sub: '12 / 24 В', at: c(5, 'car')},
];
export const S5: React.FC = () => {
  const s = useSec();
  const pct = interpolate(s, [V, V + 2], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 2)});
  const R = 250;
  const L = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={pad}>
      <Eyebrow at={0}>Швидка зарядка</Eyebrow>
      <Title at={0.1}>
        0–100% за <span style={{color: C.green}}>1,5 години</span>
      </Title>
      <div style={{position: 'absolute', left: 150, top: 370, width: 600, height: 600}}>
        <svg width={600} height={600} style={{transform: 'rotate(-90deg)'}}>
          <circle cx={300} cy={300} r={R} fill="none" stroke={C.line} strokeWidth={34} />
          <circle cx={300} cy={300} r={R} fill="none" stroke={C.cyan} strokeWidth={34} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - pct / 100)} style={{filter: 'drop-shadow(0 0 18px rgba(34,200,255,0.8))'}} />
        </svg>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 170, fontWeight: 800, letterSpacing: -6, lineHeight: 1}}>
            {Math.round(pct)}
            <span style={{fontSize: 70, color: C.cyan}}>%</span>
          </div>
          <div style={{fontSize: 30, color: C.dim}}>рівень заряду</div>
        </AbsoluteFill>
      </div>
      <div style={{position: 'absolute', right: 110, top: 400, width: 800}}>
        {charge.map((c) => (
          <Rise key={c.title} at={V + c.at} x={60} y={0}>
            <Card style={{display: 'flex', alignItems: 'center', gap: 30, marginBottom: 22}}>
              <Icon name={c.icon} size={80} color={C.green} />
              <div>
                <div style={{fontSize: 50, fontWeight: 700}}>{c.title}</div>
                <div style={{fontSize: 32, color: C.dim}}>{c.sub}</div>
              </div>
            </Card>
          </Rise>
        ))}
      </div>
      <Footnote at={0.6}>* За даними виробника: 0–100% за 1,5 години при одночасній зарядці від мережі та сонячних панелей.</Footnote>
    </AbsoluteFill>
  );
};

/* 6 — UPS */
export const S6: React.FC = () => {
  const s = useSec();
  const cut = V + 0.5; // grid goes down
  const gridOn = s < cut || (s < cut + 0.5 && Math.floor(s * 20) % 2 === 0);
  const batt = useIn(cut + 0.5);
  const ms = useIn(V + c(6, 'ms'));
  const frame = useCurrentFrame();
  const dash = -frame * 3;
  const Node: React.FC<{x: number; icon: string; label: string; color: string; dim?: boolean}> = ({x, icon, label, color, dim}) => (
    <div style={{position: 'absolute', left: x, top: 0, width: 260, textAlign: 'center', opacity: dim ? 0.3 : 1}}>
      <div style={{width: 180, height: 180, margin: '0 auto', borderRadius: 44, background: C.panel, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: dim ? 'none' : `0 0 40px ${color}55`}}>
        <Icon name={icon} size={96} color={color} />
      </div>
      <div style={{fontSize: 32, fontWeight: 600, marginTop: 18}}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={pad}>
      <Eyebrow at={0}>Безперебійне живлення · UPS</Eyebrow>
      <Title at={0.1}>Світло зникло — техніка працює</Title>
      <div style={{position: 'absolute', left: 110, top: 420, width: 1100, height: 300}}>
        <svg width={1100} height={200} style={{position: 'absolute', top: 0}}>
          <line x1={240} y1={90} x2={430} y2={90} stroke={gridOn ? C.cyan : '#3a4250'} strokeWidth={6} strokeDasharray="18 14" strokeDashoffset={gridOn ? dash : 0} />
          <line x1={670} y1={90} x2={860} y2={90} stroke={batt > 0.5 ? C.green : C.cyan} strokeWidth={6} strokeDasharray="18 14" strokeDashoffset={dash} />
        </svg>
        <Node x={0} icon="plug" label={gridOn ? 'Мережа' : 'Мережі немає'} color={gridOn ? C.cyan : '#ff5a5a'} dim={!gridOn} />
        <Node x={420} icon="bolt" label="S2000 Pro" color={C.green} />
        <Node x={840} icon="tv" label="Ваша техніка" color={batt > 0.5 ? C.green : C.cyan} />
      </div>
      <div style={{position: 'absolute', right: 110, top: 380, textAlign: 'right', opacity: ms, transform: `scale(${0.8 + ms * 0.2})`, transformOrigin: 'right center'}}>
        <div style={{fontSize: 34, color: C.dim}}>перемикання на батарею</div>
        <div style={{fontSize: 230, fontWeight: 800, letterSpacing: -8, lineHeight: 1, color: C.green, textShadow: '0 0 60px rgba(140,255,75,0.4)'}}>
          15<span style={{fontSize: 90, letterSpacing: 0}}> мс</span>
        </div>
      </div>
      <Rise at={V + c(6, 'pc')} style={{position: 'absolute', left: 110, bottom: 110}}>
        <div style={{fontSize: 38, color: C.text}}>Комп’ютер, холодильник і роутер навіть не помітять відключення.</div>
      </Rise>
    </AbsoluteFill>
  );
};

/* 7 — App */
export const S7: React.FC = () => {
  const s = useSec();
  const phone = useIn(0.2, 20);
  const out = Math.round(interpolate(s, [1, 5], [820, 960]) + Math.sin(s * 3) * 12);
  const hl = (at: number) => (s > V + at ? C.green : C.line);
  return (
    <AbsoluteFill style={pad}>
      <Product src="img/angle.png" width={820} at={0.1} style={{left: 40, top: 520, opacity: 0.9}} />
      <div style={{width: 760}}>
        <Eyebrow at={0}>Застосунок ALLPOWERS</Eyebrow>
        <Title at={0.1}>Керування зі смартфона</Title>
        <Rise at={1.2}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 30, fontSize: 34, color: C.dim}}>
            <Icon name="bt" size={48} /> Bluetooth · до 10 метрів
          </div>
        </Rise>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 250,
          top: 90 + (1 - phone) * 200,
          opacity: phone,
          width: 440,
          height: 900,
          borderRadius: 64,
          background: '#0d1118',
          border: '6px solid #2a313d',
          boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 80px rgba(34,200,255,0.18)',
          padding: '70px 34px 34px',
        }}
      >
        <div style={{position: 'absolute', top: 22, left: 160, width: 120, height: 26, borderRadius: 13, background: '#000'}} />
        <div style={{fontSize: 24, color: C.dim}}>ALLPOWERS</div>
        <div style={{fontSize: 36, fontWeight: 700}}>S2000 Pro</div>
        <div style={{margin: '26px auto 0', width: 250, height: 250, borderRadius: '50%', border: `14px solid ${C.cyan}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: `0 0 0 6px ${hl(c(7, 'charge'))}33, 0 0 40px rgba(34,200,255,0.4)`}}>
          <div style={{fontSize: 84, fontWeight: 800, lineHeight: 1}}>
            87<span style={{fontSize: 40, color: C.cyan}}>%</span>
          </div>
          <div style={{fontSize: 20, color: C.dim}}>заряд</div>
        </div>
        <div style={{display: 'flex', gap: 16, marginTop: 30}}>
          {[
            {l: 'Вхід', v: '1500', at: c(7, 'power')},
            {l: 'Вихід', v: String(out), at: c(7, 'power') + 0.3},
          ].map((x) => (
            <div key={x.l} style={{flex: 1, borderRadius: 24, padding: '18px 20px', background: C.panel, border: `2px solid ${hl(x.at)}`}}>
              <div style={{fontSize: 22, color: C.dim}}>{x.l}</div>
              <div style={{fontSize: 40, fontWeight: 800, whiteSpace: 'nowrap'}}>
                {x.v}
                <span style={{fontSize: 22, color: C.dim}}> Вт</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{display: 'flex', gap: 16, marginTop: 16}}>
          {['AC', 'DC'].map((b) => (
            <div key={b} style={{flex: 1, textAlign: 'center', borderRadius: 24, padding: '20px 0', background: 'rgba(140,255,75,0.12)', border: `2px solid ${C.green}`, color: C.green, fontSize: 34, fontWeight: 800}}>
              {b} · ON
            </div>
          ))}
        </div>
        <div style={{marginTop: 16, borderRadius: 24, padding: '16px 20px', background: C.panel, fontSize: 24, color: C.dim}}>
          Залишилось ≈ 1 год 20 хв
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 8 — Durability & portability */
export const stats = [
  {icon: 'cycle', val: '2500+', label: 'циклів заряду', sub: 'до 80% ємності', at: 0},
  {icon: 'weight', val: '13 кг', label: 'вага', sub: 'дві зручні ручки', at: c(8, 'kg')},
  {icon: 'box', val: '37,5 × 24,5 × 25', label: 'сантиметрів', sub: 'компактний корпус', at: c(8, 'handles')},
];
export const S8: React.FC = () => (
  <AbsoluteFill style={pad}>
    <Product src="img/side-left.png" width={640} at={0.1} style={{right: 110, top: 200}} />
    <div style={{width: 1000}}>
      <Eyebrow at={0}>Надійність і мобільність</Eyebrow>
      <Title at={0.1}>Беріть її куди завгодно</Title>
      <div style={{marginTop: 50}}>
        {stats.map((x) => (
          <Rise key={x.label} at={V + x.at} x={-60} y={0}>
            <Card style={{display: 'flex', alignItems: 'center', gap: 34, marginBottom: 22}}>
              <Icon name={x.icon} size={86} color={C.green} />
              <div>
                <div style={{fontSize: 74, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05}}>{x.val}</div>
                <div style={{fontSize: 30, color: C.dim}}>
                  {x.label} · {x.sub}
                </div>
              </div>
            </Card>
          </Rise>
        ))}
      </div>
    </div>
  </AbsoluteFill>
);

/* 9 — Outro */
export const S9: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 70}}>
    <Rise at={0.1} y={-30}>
      <div style={{fontSize: 30, fontWeight: 600, letterSpacing: 10, color: C.dim, textAlign: 'center'}}>ALLPOWERS</div>
      <div style={{fontSize: 130, fontWeight: 800, letterSpacing: -4, lineHeight: 1}}>
        S2000 <span style={{color: C.green}}>Pro</span>
      </div>
    </Rise>
    <Product src="img/front.png" width={820} at={0.2} style={{left: 550, top: 290}} />
    <div style={{position: 'absolute', bottom: 70, left: 0, right: 0, textAlign: 'center'}}>
      <Rise at={V + c(9, 'energy')}>
        <div style={{fontSize: 68, fontWeight: 800, letterSpacing: -2}}>
          Енергія, яка <span style={{color: C.green}}>завжди з вами</span>
        </div>
      </Rise>
      <Rise at={V + c(9, 'energy') + 0.9} y={16}>
        <div style={{fontSize: 30, color: C.dim, marginTop: 14}}>1451 Вт·год · 2400 Вт · заряд за 1,5 години · керування зі смартфона</div>
      </Rise>
    </div>
  </AbsoluteFill>
);
