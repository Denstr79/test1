import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {charge, ports, runs, stats} from './scenes';
import {c, V} from './timing';
import {C, Card, Counter, Eyebrow, Icon, Product, Rise, Title, useIn, useSec} from './ui';

/*
 * 9:16 layouts for Instagram Reels / Stories (1080×1920).
 * Key content stays between y≈250 and y≈1580 so the Instagram UI
 * (profile bar on top, caption and buttons at the bottom) never covers it.
 */
const pad: React.CSSProperties = {padding: '260px 70px 0'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Note: React.FC<{children: React.ReactNode; top: number}> = ({children, top}) => (
  <Rise at={0.5} y={10} style={{position: 'absolute', left: 70, right: 70, top}}>
    <div style={{fontSize: 23, lineHeight: 1.35, color: C.dim}}>{children}</div>
  </Rise>
);

/* 1 — Hook */
export const V1: React.FC = () => {
  const s = useSec();
  const life = V + c(1, 'life');
  const brand = V + c(1, 'brand');
  const hook = interpolate(s, [brand - 0.25, brand + 0.1], [1, 0], clamp);
  const dark = interpolate(s, [0, life, life + 0.3], [1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#000', opacity: dark}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: hook, textAlign: 'center'}}>
        <Rise at={0.1}>
          <div style={{fontSize: 150, fontWeight: 800, letterSpacing: -5, lineHeight: 1.02, color: '#5b6472'}}>
            Світло
            <br />
            зникло?
          </div>
        </Rise>
        <Rise at={life}>
          <div style={{fontSize: 150, fontWeight: 800, letterSpacing: -5, marginTop: 30, color: C.green, textShadow: '0 0 70px rgba(140,255,75,0.55)'}}>
            Життя — ні.
          </div>
        </Rise>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 330}}>
        <Rise at={brand + 0.2} y={-30}>
          <div style={{fontSize: 34, fontWeight: 600, letterSpacing: 12, color: C.dim, textAlign: 'center'}}>ALLPOWERS</div>
          <div style={{fontSize: 170, fontWeight: 800, letterSpacing: -6, lineHeight: 1}}>
            S2000 <span style={{color: C.green}}>Pro</span>
          </div>
        </Rise>
      </AbsoluteFill>
      <Product src="img/angle.png" width={1060} at={brand + 0.1} style={{left: 10, top: 700}} />
      <Rise at={brand + 1.9} y={20} style={{position: 'absolute', left: 70, right: 70, top: 1330, textAlign: 'center'}}>
        <div style={{fontSize: 52, fontWeight: 600, lineHeight: 1.2}}>
          Портативна електростанція
          <br />
          <span style={{color: C.dim}}>для вашого дому</span>
        </div>
      </Rise>
    </AbsoluteFill>
  );
};

/* 2 — Capacity & power */
export const V2: React.FC = () => {
  const w = V + c(2, 'w');
  const peak = useIn(w + 2);
  return (
    <AbsoluteFill style={pad}>
      <Eyebrow at={0}>Ємність і потужність</Eyebrow>
      <Rise at={V + 0.1}>
        <div style={{fontSize: 230, fontWeight: 800, letterSpacing: -10, lineHeight: 1, marginTop: 30}}>
          <Counter to={1451} at={V + 0.1} dur={1.8} />
          <span style={{fontSize: 70, color: C.cyan, letterSpacing: 0, marginLeft: 14}}>Вт·год</span>
        </div>
        <div style={{fontSize: 36, color: C.dim}}>ємність акумулятора</div>
      </Rise>
      <Rise at={w}>
        <div style={{fontSize: 230, fontWeight: 800, letterSpacing: -10, lineHeight: 1, marginTop: 36}}>
          <Counter to={2400} at={w} dur={1.4} />
          <span style={{fontSize: 70, color: C.green, letterSpacing: 0, marginLeft: 14}}>Вт</span>
        </div>
        <div style={{fontSize: 36, color: C.dim}}>чиста синусоїда · 4 розетки 220–240 В</div>
      </Rise>
      <div style={{marginTop: 46, opacity: peak}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 36, fontWeight: 600}}>
          <span>Пікове навантаження</span>
          <span style={{color: C.green}}>до 4000 Вт</span>
        </div>
        <div style={{height: 18, borderRadius: 9, background: C.line, marginTop: 16, overflow: 'hidden'}}>
          <div style={{height: '100%', width: `${peak * 100}%`, borderRadius: 9, background: `linear-gradient(90deg, ${C.cyan}, ${C.green})`}} />
        </div>
      </div>
      <Product src="img/front.png" width={860} at={0.1} style={{left: 110, top: 1090}} />
    </AbsoluteFill>
  );
};

/* 3 — Runtimes */
const RunRow: React.FC<{r: (typeof runs)[number]}> = ({r}) => {
  const p = useIn(V + r.at);
  const bar = useIn(V + r.at + 0.2, 30);
  return (
    <Card
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        marginBottom: 18,
        padding: '22px 32px',
        opacity: 0.25 + p * 0.75,
        transform: `translateX(${(1 - p) * 60}px)`,
        borderColor: p > 0.5 ? 'rgba(34,200,255,0.35)' : C.line,
      }}
    >
      <Icon name={r.icon} size={92} />
      <div style={{fontSize: 40, fontWeight: 600, flex: 1}}>{r.name}</div>
      <div style={{textAlign: 'right', opacity: p}}>
        <div style={{fontSize: 92, fontWeight: 800, letterSpacing: -3, lineHeight: 1}}>{r.val}</div>
        <div style={{fontSize: 30, color: C.green, fontWeight: 600}}>{r.unit}</div>
      </div>
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 7, width: `${bar * r.bar * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.green})`}} />
    </Card>
  );
};
export const V3: React.FC = () => (
  <AbsoluteFill style={pad}>
    <Eyebrow at={0}>На одному заряді</Eyebrow>
    <Title at={0.05} size={88}>
      Скільки працює
      <br />
      ваша техніка
    </Title>
    <div style={{marginTop: 46}}>
      {runs.map((r) => (
        <RunRow key={r.name} r={r} />
      ))}
    </div>
    <Note top={1528}>
      * Орієнтовно, при ~85% ККД: холодильник ≈ 60 Вт, роутер ≈ 10 Вт, телевізор ≈ 100 Вт, чайник 2000 Вт (1,5 л), прання ≈ 0,6–0,9 кВт·год.
    </Note>
  </AbsoluteFill>
);

/* 4 — Ports */
const IMG_W = 980;
const k = IMG_W / 1673;
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
        border: `4px solid ${C.green}`,
        boxShadow: `0 0 ${18 + Math.sin(frame / 6) * 8}px rgba(140,255,75,0.7)`,
        opacity: a,
        transform: `scale(${1.25 - a * 0.25})`,
      }}
    />
  );
};
export const V4: React.FC = () => (
  <AbsoluteFill style={pad}>
    <Eyebrow at={0}>Підключення</Eyebrow>
    <Title at={0.05} size={88}>Усе, що потрібно</Title>
    <Product src="img/front.png" width={IMG_W} style={{left: 50, top: 500}}>
      {ports.map((p) => (
        <Ring key={p.title} p={p} />
      ))}
    </Product>
    <div style={{position: 'absolute', left: 70, right: 70, top: 1090, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
      {ports.map((p) => (
        <Rise key={p.title} at={V + p.at} y={40}>
          <Card style={{padding: '22px 26px', height: 150}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <Icon name={p.icon} size={54} color={C.green} />
              <div style={{fontSize: 44, fontWeight: 700, whiteSpace: 'nowrap'}}>{p.title}</div>
            </div>
            <div style={{fontSize: 28, color: C.dim, marginTop: 10}}>{p.sub}</div>
          </Card>
        </Rise>
      ))}
    </div>
    <Rise at={V + c(4, 'total')} style={{position: 'absolute', left: 70, right: 70, top: 1420}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26}}>
        <span style={{fontSize: 170, fontWeight: 800, letterSpacing: -6, color: C.green, lineHeight: 1}}>11</span>
        <span style={{fontSize: 50, fontWeight: 600, lineHeight: 1.15}}>
          пристроїв
          <br />
          одночасно
        </span>
      </div>
    </Rise>
  </AbsoluteFill>
);

/* 5 — Charging */
export const V5: React.FC = () => {
  const s = useSec();
  const pct = interpolate(s, [V, V + 2], [0, 100], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 2)});
  const R = 215;
  const L = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={pad}>
      <Eyebrow at={0}>Швидка зарядка</Eyebrow>
      <Title at={0.05} size={96}>
        0–100% за
        <br />
        <span style={{color: C.green}}>1,5 години</span>
      </Title>
      <div style={{position: 'absolute', left: 280, top: 610, width: 520, height: 520}}>
        <svg width={520} height={520} style={{transform: 'rotate(-90deg)'}}>
          <circle cx={260} cy={260} r={R} fill="none" stroke={C.line} strokeWidth={32} />
          <circle cx={260} cy={260} r={R} fill="none" stroke={C.cyan} strokeWidth={32} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - pct / 100)} style={{filter: 'drop-shadow(0 0 18px rgba(34,200,255,0.8))'}} />
        </svg>
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{fontSize: 150, fontWeight: 800, letterSpacing: -6, lineHeight: 1}}>
            {Math.round(pct)}
            <span style={{fontSize: 64, color: C.cyan}}>%</span>
          </div>
          <div style={{fontSize: 30, color: C.dim}}>рівень заряду</div>
        </AbsoluteFill>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1170}}>
        {charge.map((x) => (
          <Rise key={x.title} at={V + x.at} x={60} y={0}>
            <Card style={{display: 'flex', alignItems: 'center', gap: 28, marginBottom: 14, padding: '18px 30px'}}>
              <Icon name={x.icon} size={66} color={C.green} />
              <div style={{fontSize: 44, fontWeight: 700, flex: 1}}>{x.title}</div>
              <div style={{fontSize: 32, color: C.dim}}>{x.sub}</div>
            </Card>
          </Rise>
        ))}
      </div>
      <Note top={1530}>* За даними виробника — при одночасній зарядці від мережі та сонячних панелей.</Note>
    </AbsoluteFill>
  );
};

/* 6 — UPS */
export const V6: React.FC = () => {
  const s = useSec();
  const cut = V + 0.5;
  const gridOn = s < cut || (s < cut + 0.5 && Math.floor(s * 20) % 2 === 0);
  const batt = useIn(cut + 0.5);
  const ms = useIn(V + c(6, 'ms'));
  const dash = -useCurrentFrame() * 3;
  const Node: React.FC<{x: number; icon: string; label: string; color: string; dim?: boolean}> = ({x, icon, label, color, dim}) => (
    <div style={{position: 'absolute', left: x, top: 0, width: 260, textAlign: 'center', opacity: dim ? 0.35 : 1}}>
      <div style={{width: 190, height: 190, margin: '0 auto', borderRadius: 46, background: C.panel, border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: dim ? 'none' : `0 0 40px ${color}55`}}>
        <Icon name={icon} size={104} color={color} />
      </div>
      <div style={{fontSize: 32, fontWeight: 600, marginTop: 18}}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={pad}>
      <Eyebrow at={0}>Безперебійне живлення · UPS</Eyebrow>
      <Title at={0.05} size={92}>
        Світло зникло —
        <br />
        техніка працює
      </Title>
      <div style={{position: 'absolute', left: 70, top: 660, width: 940, height: 300}}>
        <svg width={940} height={200} style={{position: 'absolute', top: 0}}>
          <line x1={230} y1={95} x2={370} y2={95} stroke={gridOn ? C.cyan : '#3a4250'} strokeWidth={7} strokeDasharray="18 14" strokeDashoffset={gridOn ? dash : 0} />
          <line x1={570} y1={95} x2={710} y2={95} stroke={batt > 0.5 ? C.green : C.cyan} strokeWidth={7} strokeDasharray="18 14" strokeDashoffset={dash} />
        </svg>
        <Node x={0} icon="plug" label={gridOn ? 'Мережа' : 'Мережі немає'} color={gridOn ? C.cyan : '#ff5a5a'} dim={!gridOn} />
        <Node x={340} icon="bolt" label="S2000 Pro" color={C.green} />
        <Node x={680} icon="tv" label="Ваша техніка" color={batt > 0.5 ? C.green : C.cyan} />
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1000, textAlign: 'center', opacity: ms, transform: `scale(${0.8 + ms * 0.2})`}}>
        <div style={{fontSize: 40, color: C.dim}}>перемикання на батарею</div>
        <div style={{fontSize: 330, fontWeight: 800, letterSpacing: -12, lineHeight: 1, color: C.green, textShadow: '0 0 70px rgba(140,255,75,0.45)'}}>
          15<span style={{fontSize: 120, letterSpacing: 0}}> мс</span>
        </div>
      </div>
      <Rise at={V + c(6, 'pc')} style={{position: 'absolute', left: 70, right: 70, top: 1430, textAlign: 'center'}}>
        <div style={{fontSize: 44, lineHeight: 1.25}}>Комп’ютер, холодильник і роутер навіть не помітять відключення</div>
      </Rise>
    </AbsoluteFill>
  );
};

/* 7 — App */
export const V7: React.FC = () => {
  const s = useSec();
  const phone = useIn(0.15, 20);
  const out = Math.round(interpolate(s, [1, 5], [820, 960]) + Math.sin(s * 3) * 12);
  const hl = (at: number) => (s > V + at ? C.green : C.line);
  return (
    <AbsoluteFill style={pad}>
      <Eyebrow at={0}>Застосунок ALLPOWERS</Eyebrow>
      <Title at={0.05} size={92}>
        Керування
        <br />
        зі смартфона
      </Title>
      <Rise at={V + c(7, 'bt') - 0.4}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 24, fontSize: 38, color: C.dim}}>
          <Icon name="bt" size={52} /> Bluetooth · до 10 метрів
        </div>
      </Rise>
      <div
        style={{
          position: 'absolute',
          left: 310,
          top: 680 + (1 - phone) * 200,
          opacity: phone,
          width: 460,
          height: 890,
          borderRadius: 64,
          background: '#0d1118',
          border: '6px solid #2a313d',
          boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 90px rgba(34,200,255,0.22)',
          padding: '66px 34px 30px',
        }}
      >
        <div style={{position: 'absolute', top: 22, left: 170, width: 120, height: 26, borderRadius: 13, background: '#000'}} />
        <div style={{fontSize: 24, color: C.dim}}>ALLPOWERS</div>
        <div style={{fontSize: 38, fontWeight: 700}}>S2000 Pro</div>
        <div style={{margin: '24px auto 0', width: 260, height: 260, borderRadius: '50%', border: `14px solid ${C.cyan}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: `0 0 0 6px ${hl(c(7, 'charge'))}55, 0 0 40px rgba(34,200,255,0.4)`}}>
          <div style={{fontSize: 88, fontWeight: 800, lineHeight: 1}}>
            87<span style={{fontSize: 42, color: C.cyan}}>%</span>
          </div>
          <div style={{fontSize: 22, color: C.dim}}>заряд</div>
        </div>
        <div style={{display: 'flex', gap: 16, marginTop: 28}}>
          {[
            {l: 'Вхід', v: '1500', at: c(7, 'power')},
            {l: 'Вихід', v: String(out), at: c(7, 'power') + 0.3},
          ].map((x) => (
            <div key={x.l} style={{flex: 1, borderRadius: 24, padding: '16px 20px', background: C.panel, border: `2px solid ${hl(x.at)}`}}>
              <div style={{fontSize: 22, color: C.dim}}>{x.l}</div>
              <div style={{fontSize: 42, fontWeight: 800, whiteSpace: 'nowrap'}}>
                {x.v}
                <span style={{fontSize: 22, color: C.dim}}> Вт</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{display: 'flex', gap: 16, marginTop: 16}}>
          {['AC', 'DC'].map((b) => (
            <div key={b} style={{flex: 1, textAlign: 'center', borderRadius: 24, padding: '18px 0', background: 'rgba(140,255,75,0.12)', border: `2px solid ${C.green}`, color: C.green, fontSize: 34, fontWeight: 800}}>
              {b} · ON
            </div>
          ))}
        </div>
        <div style={{marginTop: 16, borderRadius: 24, padding: '16px 20px', background: C.panel, fontSize: 24, color: C.dim}}>Залишилось ≈ 1 год 20 хв</div>
      </div>
    </AbsoluteFill>
  );
};

/* 8 — Durability & portability */
export const V8: React.FC = () => (
  <AbsoluteFill style={pad}>
    <Eyebrow at={0}>Надійність і мобільність</Eyebrow>
    <Title at={0.05} size={92}>
      Беріть її
      <br />
      куди завгодно
    </Title>
    <Product src="img/side-left.png" width={470} at={0.1} style={{left: 305, top: 610}} />
    <div style={{position: 'absolute', left: 70, right: 70, top: 1150}}>
      {stats.map((x) => (
        <Rise key={x.label} at={V + x.at} x={-60} y={0}>
          <Card style={{display: 'flex', alignItems: 'center', gap: 28, marginBottom: 14, padding: '16px 30px'}}>
            <Icon name={x.icon} size={72} color={C.green} />
            <div>
              <div style={{fontSize: 60, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05}}>{x.val}</div>
              <div style={{fontSize: 28, color: C.dim}}>
                {x.label} · {x.sub}
              </div>
            </div>
          </Card>
        </Rise>
      ))}
    </div>
  </AbsoluteFill>
);

/* 9 — Outro */
export const V9: React.FC = () => (
  <AbsoluteFill style={{alignItems: 'center', paddingTop: 330}}>
    <Rise at={0.1} y={-30}>
      <div style={{fontSize: 34, fontWeight: 600, letterSpacing: 12, color: C.dim, textAlign: 'center'}}>ALLPOWERS</div>
      <div style={{fontSize: 170, fontWeight: 800, letterSpacing: -6, lineHeight: 1}}>
        S2000 <span style={{color: C.green}}>Pro</span>
      </div>
    </Rise>
    <Product src="img/front.png" width={980} at={0.15} style={{left: 50, top: 640}} />
    <div style={{position: 'absolute', top: 1260, left: 70, right: 70, textAlign: 'center'}}>
      <Rise at={V + c(9, 'energy')}>
        <div style={{fontSize: 92, fontWeight: 800, letterSpacing: -3, lineHeight: 1.08}}>
          Енергія, яка
          <br />
          <span style={{color: C.green}}>завжди з вами</span>
        </div>
      </Rise>
      <Rise at={V + c(9, 'energy') + 0.9} y={16}>
        <div style={{fontSize: 34, color: C.dim, marginTop: 22, lineHeight: 1.35}}>
          1451 Вт·год · 2400 Вт
          <br />
          заряд за 1,5 години · керування зі смартфона
        </div>
      </Rise>
    </div>
  </AbsoluteFill>
);
