import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile,
} from 'remotion';
import {Audio} from '@remotion/media';
import {
  Scale, Building2, User, Clock, Wrench, Brain, FlaskConical, Trophy, TrendingUp,
  Check, X, ArrowRight, HelpCircle, AlertTriangle, Handshake, Heart, Share2,
  MessageCircle, Bell, Sparkles, Target,
} from 'lucide-react';
import {ep01 as T} from '../styles/ep01Theme';
import timeline from '../../public/media/ep01/timeline.json';

const C = T.colors;
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const fr = (timeline as {fragments: {index: number; startMs: number; endMs: number; text: string}[]; totalMs: number});
const startMsOf = (i: number) => fr.fragments.find((f) => f.index === i)!.startMs;

// ---------- primitives ----------
const useReveal = (delaySec = 0, cfg = T.spring) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return clamp(spring({frame: frame - Math.round(delaySec * fps), fps, config: cfg}));
};

const Reveal = ({children, delay = 0, y = 34, style}: {children: ReactNode; delay?: number; y?: number; style?: CSSProperties}) => {
  const v = useReveal(delay);
  return <div style={{opacity: v, transform: `translateY(${interpolate(v, [0, 1], [y, 0])}px)`, ...style}}>{children}</div>;
};

const Kicker = ({children, color = C.muted, delay = 0}: {children: ReactNode; color?: string; delay?: number}) => (
  <Reveal delay={delay}>
    <div style={{fontSize: 30, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase', color}}>{children}</div>
  </Reveal>
);

// Headline where each word springs in. Wrap text in *asterisks* to accent-color it
// (supports multi-word spans and punctuation glued to words).
const parseAccent = (text: string) => {
  let inAccent = false;
  return text.split(' ').map((word) => {
    const accent = inAccent || word.startsWith('*');
    let core = '';
    for (const ch of word) {
      if (ch === '*') inAccent = !inAccent;
      else core += ch;
    }
    return {text: core, accent};
  }).filter((w) => w.text.length > 0);
};

const Headline = ({text, size = 86, accent = C.gold, delay = 0, lineHeight = 1.08}: {
  text: string; size?: number; accent?: string; delay?: number; lineHeight?: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = parseAccent(text);
  return (
    <div style={{fontSize: size, fontWeight: 820, lineHeight, letterSpacing: -1}}>
      {words.map((w, i) => {
        const v = clamp(spring({frame: frame - Math.round((delay + i * 0.055) * fps), fps, config: {damping: 20, stiffness: 170, mass: 0.8}}));
        return (
          <span key={i} style={{display: 'inline-block', marginRight: '0.26em', opacity: v, transform: `translateY(${interpolate(v, [0, 1], [26, 0])}px)`, color: w.accent ? accent : C.text}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const Chip = ({icon, label, delay = 0, color = C.teal}: {icon: ReactNode; label: string; delay?: number; color?: string}) => (
  <Reveal delay={delay} y={26}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '22px 28px', background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 18}}>
      <div style={{width: 58, height: 58, borderRadius: 14, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0}}>{icon}</div>
      <span style={{fontSize: 40, fontWeight: 650, color: C.text}}>{label}</span>
    </div>
  </Reveal>
);

// A stylized balance/scale. tilt: -1 (left/candidate down) .. +1 (right/company down).
const Balance = ({tilt, size = 460, leftColor = C.teal, rightColor = C.gold}: {tilt: number; size?: number; leftColor?: string; rightColor?: string}) => {
  const w = size, h = size * 0.86;
  const cx = w / 2, pivotY = h * 0.16, beam = w * 0.78, drop = h * 0.34;
  const ang = (tilt * 11) * Math.PI / 180;
  const lx = cx - Math.cos(ang) * beam / 2, ly = pivotY + Math.sin(ang) * beam / 2 * -1 + Math.sin(ang) * beam; // placeholder
  // Compute beam ends by rotation around pivot
  const end = (dir: number) => ({x: cx + dir * Math.cos(ang) * beam / 2, y: pivotY + dir * Math.sin(ang) * beam / 2});
  const L = end(-1), R = end(1);
  const pan = (p: {x: number; y: number}, color: string) => (
    <g>
      <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + drop} stroke={C.panelBorder} strokeWidth={3} />
      <path d={`M ${p.x - 52} ${p.y + drop} A 52 30 0 0 0 ${p.x + 52} ${p.y + drop} Z`} fill="none" stroke={color} strokeWidth={6} />
      <circle cx={p.x} cy={p.y} r={7} fill={color} />
    </g>
  );
  return (
    <svg width={w} height={h + 20} viewBox={`0 0 ${w} ${h + 20}`}>
      {/* base */}
      <rect x={cx - 70} y={h - 10} width={140} height={12} rx={6} fill={C.panelBorder} />
      <rect x={cx - 8} y={pivotY} width={16} height={h - pivotY - 8} rx={8} fill="rgba(255,255,255,0.14)" />
      {/* beam */}
      <line x1={L.x} y1={L.y} x2={R.x} y2={R.y} stroke={C.text} strokeWidth={10} strokeLinecap="round" />
      <circle cx={cx} cy={pivotY} r={14} fill={C.text} />
      {pan(L, leftColor)}
      {pan(R, rightColor)}
    </svg>
  );
};

const Scene = ({children, justify = 'center', style}: {children: ReactNode; justify?: CSSProperties['justifyContent']; style?: CSSProperties}) => (
  <AbsoluteFill style={{padding: `${T.safe.top + 70}px ${T.safe.x}px ${T.safe.bottom + 40}px`, display: 'flex', flexDirection: 'column', justifyContent: justify, gap: 40, ...style}}>
    {children}
  </AbsoluteFill>
);

// ---------- scenes ----------
const S_Intro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // "boom" reveal of the big title around local 1.9s
  const boomAt = Math.round(2.0 * fps);
  const boom = clamp(spring({frame: frame - boomAt, fps, config: {damping: 11, stiffness: 150, mass: 0.7}}));
  const flash = interpolate(frame - boomAt, [0, 3, 12], [0, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ring = interpolate(frame - boomAt, [0, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const tilt = interpolate(boom, [0, 1], [0, 1]); // scale tips toward "company" on boom
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 30, padding: `0 ${T.safe.x}px`}}>
      <Kicker delay={0.2} color={C.gold}>Psychologie du recrutement</Kicker>
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 10}}>
        {/* shock ring */}
        <div style={{position: 'absolute', top: 150, width: 8 + ring * 900, height: 8 + ring * 900, borderRadius: '50%', border: `3px solid rgba(246,185,77,${(1 - ring) * 0.5})`, opacity: 1 - ring}} />
        <div style={{transform: `scale(${interpolate(boom, [0, 1], [0.6, 1])})`, textAlign: 'center'}}>
          <div style={{fontSize: 118, fontWeight: 880, letterSpacing: -3, lineHeight: 0.98, color: C.text}}>LE RAPPORT</div>
          <div style={{fontSize: 118, fontWeight: 880, letterSpacing: -3, lineHeight: 0.98, color: C.gold}}>DE POUVOIR</div>
        </div>
      </div>
      <div style={{marginTop: 26, opacity: clamp((frame - boomAt - 8) / 12)}}>
        <Balance tilt={tilt} size={360} />
      </div>
      <Reveal delay={2.6}>
        <div style={{marginTop: 8, padding: '14px 30px', border: `1.5px solid ${C.panelBorder}`, borderRadius: 999, fontSize: 30, fontWeight: 750, letterSpacing: 4, color: C.muted}}>ÉPISODE 1</div>
      </Reveal>
      <AbsoluteFill style={{background: '#fff', opacity: flash, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

const S_LowPower = () => (
  <Scene>
    <Kicker delay={0}>Le point de départ</Kicker>
    <Headline text="En entretien, le candidat se sent en position de *faiblesse*." size={82} accent={C.coral} delay={0.15} />
    <Reveal delay={1.1} style={{alignSelf: 'center', marginTop: 20}}>
      <Balance tilt={0.85} size={420} />
    </Reveal>
    <Reveal delay={1.5}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 700, color: C.muted}}>
        <span>VOUS</span><span style={{color: C.gold}}>L'ENTREPRISE</span>
      </div>
    </Reveal>
  </Scene>
);

const S_Why = () => (
  <Scene>
    <Kicker delay={0}>Pourquoi ce ressenti</Kicker>
    <div style={{display: 'grid', gap: 24, marginTop: 8}}>
      <Chip icon={<Target size={32} />} label="Il veut le poste" delay={0.2} color={C.gold} />
      <Chip icon={<User size={32} />} label="Il sait qu'il est évalué" delay={0.5} color={C.gold} />
      <Chip icon={<Building2 size={32} />} label="L'entreprise détient la décision" delay={0.8} color={C.gold} />
    </div>
  </Scene>
);

const S_Perception = () => (
  <Scene>
    <Headline text="Et cette *perception* change sa façon de se présenter." size={88} accent={C.teal} />
    <Reveal delay={1.0} style={{alignSelf: 'center'}}>
      <Brain size={140} color={C.teal} strokeWidth={1.4} />
    </Reveal>
  </Scene>
);

const S_Study = () => (
  <Scene>
    <Kicker delay={0} color={C.teal}>Ce que dit la recherche</Kicker>
    <Reveal delay={0.25}>
      <div style={{padding: 44, background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 26}}>
        <FlaskConical size={92} color={C.teal} strokeWidth={1.5} />
        <div style={{fontSize: 32, color: C.muted, marginTop: 26, fontWeight: 600}}>Étude publiée dans le</div>
        <div style={{fontSize: 52, fontWeight: 800, marginTop: 8, lineHeight: 1.1, color: C.text}}>Journal of Experimental Social Psychology</div>
      </div>
    </Reveal>
  </Scene>
);

const GroupCard = ({title, sub, level, color, delay}: {title: string; sub: string; level: number; color: string; delay: number}) => {
  const v = useReveal(delay);
  return (
    <div style={{flex: 1, opacity: v, transform: `translateY(${interpolate(v, [0, 1], [30, 0])}px)`, background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 22, padding: 26, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center'}}>
      <div style={{fontSize: 30, fontWeight: 800, color}}>{title}</div>
      <div style={{display: 'flex', gap: 8, alignItems: 'flex-end', height: 120}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 26, borderRadius: 6, background: i < level ? color : 'rgba(255,255,255,0.10)', height: `${40 + i * 40}%`}} />
        ))}
      </div>
      <div style={{fontSize: 26, color: C.muted, fontWeight: 600}}>{sub}</div>
    </div>
  );
};

const S_Groups = () => (
  <Scene justify="center">
    <Kicker delay={0}>L'expérience : 3 groupes</Kicker>
    <div style={{display: 'flex', gap: 20, marginTop: 10}}>
      <GroupCard title="Pouvoir" sub="souvenir fort" level={3} color={C.gold} delay={0.3} />
      <GroupCard title="Peu de pouvoir" sub="souvenir faible" level={1} color={C.coral} delay={0.6} />
      <GroupCard title="Neutre" sub="témoin" level={2} color={C.muted} delay={0.9} />
    </div>
    <Reveal delay={1.3}>
      <div style={{fontSize: 32, color: C.muted, textAlign: 'center', fontWeight: 600}}>Chacun se remémore une situation avant l'entretien.</div>
    </Reveal>
  </Scene>
);

const S_Result = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = clamp(spring({frame: frame - Math.round(0.3 * fps), fps, config: {damping: 12, stiffness: 140}}));
  return (
    <Scene>
      <Reveal><div style={{fontSize: 34, fontWeight: 800, letterSpacing: 6, color: C.gold, textTransform: 'uppercase'}}>Résultat</div></Reveal>
      <Headline text="Se sentir en position de *pouvoir*..." size={78} accent={C.gold} delay={0.2} />
      <div style={{display: 'grid', gap: 22, marginTop: 6}}>
        {[{icon: <Trophy size={40} />, label: 'davantage préférés'}, {icon: <TrendingUp size={40} />, label: 'perçus plus persuasifs'}].map((it, i) => {
          const v = clamp(spring({frame: frame - Math.round((0.7 + i * 0.25) * fps), fps, config: T.spring}));
          return (
            <div key={i} style={{opacity: v, transform: `translateX(${interpolate(v, [0, 1], [40, 0])}px)`, display: 'flex', alignItems: 'center', gap: 24, padding: '26px 30px', background: 'rgba(246,185,77,0.10)', border: `1px solid rgba(246,185,77,0.35)`, borderRadius: 18}}>
              <div style={{color: C.gold}}>{it.icon}</div>
              <span style={{fontSize: 46, fontWeight: 800, color: C.text}}>{it.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{transform: `scale(${interpolate(pop, [0, 1], [0.9, 1])})`, opacity: pop, alignSelf: 'center', marginTop: 6}}>
        <Sparkles size={80} color={C.gold} />
      </div>
    </Scene>
  );
};

const S_Influence = () => (
  <Scene>
    <Headline text="Votre *perception* influence la façon dont on vous perçoit." size={84} accent={C.teal} />
  </Scene>
);

const S_KeyIdea = () => (
  <Scene justify="center">
    <Kicker delay={0} color={C.teal}>À retenir</Kicker>
    <Headline text="Le recruteur, *lui aussi*, a un besoin." size={96} accent={C.teal} delay={0.2} />
    <Reveal delay={1.0} style={{alignSelf: 'center', marginTop: 16}}>
      <Balance tilt={0} size={420} />
    </Reveal>
  </Scene>
);

const NeedColumn = ({title, icon, items, color, delay}: {title: string; icon: ReactNode; items: {icon: ReactNode; label: string}[]; color: string; delay: number}) => {
  const v = useReveal(delay);
  return (
    <div style={{flex: 1, opacity: v, transform: `translateY(${interpolate(v, [0, 1], [30, 0])}px)`, background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 22, padding: 30, display: 'flex', flexDirection: 'column', gap: 22}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, color}}>
        {icon}<span style={{fontSize: 32, fontWeight: 800, letterSpacing: 2}}>{title}</span>
      </div>
      {items.map((it, i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 32, fontWeight: 600, color: C.text}}>
          <span style={{color}}>{it.icon}</span>{it.label}
        </div>
      ))}
    </div>
  );
};

const S_TwoNeeds = () => (
  <Scene justify="center">
    <Kicker delay={0}>Un échange, pas un examen</Kicker>
    <div style={{display: 'flex', gap: 20, marginTop: 6}}>
      <NeedColumn title="L'ENTREPRISE" icon={<Building2 size={40} />} color={C.gold} delay={0.3}
        items={[{icon: <Target size={28} />, label: 'un poste à pourvoir'}, {icon: <Wrench size={28} />, label: 'un problème à résoudre'}, {icon: <Check size={28} />, label: 'des compétences'}]} />
      <NeedColumn title="VOUS" icon={<User size={40} />} color={C.teal} delay={0.7}
        items={[{icon: <Brain size={28} />, label: 'des compétences'}, {icon: <Clock size={28} />, label: 'du temps'}, {icon: <TrendingUp size={28} />, label: 'une capacité de travail'}]} />
    </div>
  </Scene>
);

const S_Reframe = () => (
  <Scene justify="center">
    <Reveal delay={0.1}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '26px 30px', border: `1px solid rgba(255,107,107,0.4)`, background: 'rgba(255,107,107,0.08)', borderRadius: 18}}>
        <X size={44} color={C.coral} />
        <span style={{fontSize: 44, fontWeight: 700, color: C.text, textDecoration: 'line-through', textDecorationColor: C.coral}}>« Je dois absolument les convaincre »</span>
      </div>
    </Reveal>
    <Reveal delay={0.7} style={{alignSelf: 'center'}}><ArrowRight size={70} color={C.muted} style={{transform: 'rotate(90deg)'}} /></Reveal>
    <Reveal delay={1.1}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '26px 30px', border: `1px solid rgba(55,224,190,0.4)`, background: 'rgba(55,224,190,0.10)', borderRadius: 18}}>
        <Check size={44} color={C.teal} />
        <span style={{fontSize: 44, fontWeight: 750, color: C.text}}>« Ils ont un besoin. Est-ce que j'y réponds ? »</span>
      </div>
    </Reveal>
  </Scene>
);

const S_Question = () => {
  const v = useReveal(0.2);
  return (
    <Scene justify="center">
      <Kicker delay={0} color={C.gold}>La question redoutée</Kicker>
      <div style={{opacity: v, transform: `scale(${interpolate(v, [0, 1], [0.92, 1])})`, padding: 46, background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 26, position: 'relative'}}>
        <HelpCircle size={72} color={C.gold} style={{position: 'absolute', top: -30, left: 40}} />
        <div style={{fontSize: 76, fontWeight: 820, lineHeight: 1.1, color: C.text, marginTop: 20}}>« Pourquoi vous, plutôt qu'un autre&nbsp;? »</div>
      </div>
    </Scene>
  );
};

const S_TwoModes = () => (
  <Scene justify="center">
    <Reveal delay={0.15}>
      <div style={{padding: 30, borderRadius: 20, background: 'rgba(255,107,107,0.08)', border: `1px solid rgba(255,107,107,0.35)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, color: C.coral, fontWeight: 800, fontSize: 30, marginBottom: 12}}><AlertTriangle size={34} /> SI VOUS VOUS SENTEZ ÉVALUÉ</div>
        <div style={{fontSize: 40, fontWeight: 650, color: C.text}}>Vous paniquez, vous voulez surconvaincre.</div>
      </div>
    </Reveal>
    <Reveal delay={0.7}>
      <div style={{padding: 30, borderRadius: 20, background: 'rgba(55,224,190,0.10)', border: `1px solid rgba(55,224,190,0.4)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, color: C.teal, fontWeight: 800, fontSize: 30, marginBottom: 12}}><Scale size={34} /> DANS UN RAPPORT ÉQUILIBRÉ</div>
        <div style={{fontSize: 40, fontWeight: 650, color: C.text}}>Vous montrez comment vous résolvez son problème.</div>
      </div>
    </Reveal>
  </Scene>
);

const S_Remember = () => (
  <Scene justify="center">
    <Kicker delay={0} color={C.gold}>La prochaine fois</Kicker>
    <Headline text="Vous n'arrivez pas *les mains vides*." size={92} accent={C.gold} delay={0.2} />
    <Reveal delay={1.0}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, fontSize: 40, fontWeight: 650, color: C.text}}>
        <Check size={40} color={C.teal} /> Vous avez ce dont elle a besoin.
      </div>
    </Reveal>
  </Scene>
);

const S_Collab = () => (
  <Scene justify="center">
    <Reveal style={{alignSelf: 'center'}} delay={0.1}><Handshake size={150} color={C.teal} strokeWidth={1.4} /></Reveal>
    <Headline text="Une *discussion* entre deux parties." size={86} accent={C.teal} delay={0.4} />
    <Reveal delay={1.1}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 38, fontWeight: 600, color: C.muted}}>
        <X size={34} color={C.coral} /> pas un examen à réussir.
      </div>
    </Reveal>
  </Scene>
);

const S_Cta = () => {
  const actions = [{icon: <Bell size={38} />, label: 'Abonne-toi'}, {icon: <Heart size={38} />, label: "J'aime"}, {icon: <Share2 size={38} />, label: 'Partage'}, {icon: <MessageCircle size={38} />, label: 'Commente'}];
  return (
    <Scene justify="center">
      <Headline text="Des conseils pour *réussir* tes entretiens." size={80} accent={C.gold} delay={0.1} />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 16}}>
        {actions.map((a, i) => {
          const v = useReveal(0.5 + i * 0.18);
          return (
            <div key={i} style={{opacity: v, transform: `scale(${interpolate(v, [0, 1], [0.85, 1])})`, display: 'flex', alignItems: 'center', gap: 18, padding: '26px 24px', background: C.panel, border: `1px solid ${C.panelBorder}`, borderRadius: 18, color: C.teal}}>
              {a.icon}<span style={{fontSize: 36, fontWeight: 750, color: C.text}}>{a.label}</span>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

// ---------- scene schedule ----------
const SCENES: {id: number; C: () => ReactNode}[] = [
  {id: 0, C: S_Intro}, {id: 2, C: S_LowPower}, {id: 3, C: S_Why}, {id: 4, C: S_Perception},
  {id: 5, C: S_Study}, {id: 6, C: S_Groups}, {id: 10, C: S_Result}, {id: 11, C: S_Influence},
  {id: 12, C: S_KeyIdea}, {id: 14, C: S_TwoNeeds}, {id: 16, C: S_Reframe}, {id: 18, C: S_Question},
  {id: 20, C: S_TwoModes}, {id: 22, C: S_Remember}, {id: 25, C: S_Collab}, {id: 27, C: S_Cta},
];

const Background = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 120) * 30;
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% ${18 + drift / 20}%, ${C.bg1} 0%, ${C.bg0} 62%)`}}>
      <AbsoluteFill style={{background: 'radial-gradient(50% 30% at 50% 8%, rgba(246,185,77,0.10), transparent 70%)'}} />
    </AbsoluteFill>
  );
};

const Chrome = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = clamp(frame / (durationInFrames - 1));
  return (
    <>
      <div style={{position: 'absolute', top: 70, left: T.safe.x, right: T.safe.x, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, color: C.muted, fontSize: 26, fontWeight: 750, letterSpacing: 3}}>
          <Scale size={30} color={C.gold} /> WOODLE CAREER
        </div>
        <div style={{color: C.muted, fontSize: 26, fontWeight: 750, letterSpacing: 3}}>EP.01</div>
      </div>
      <div style={{position: 'absolute', top: 118, left: T.safe.x, right: T.safe.x, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3}}>
        <div style={{width: `${p * 100}%`, height: '100%', background: C.gold, borderRadius: 3}} />
      </div>
    </>
  );
};

const Sfx = ({at, src, volume}: {at: number; src: string; volume: number}) => (
  <Sequence from={at} durationInFrames={90}><Audio src={staticFile(src)} volume={volume} /></Sequence>
);

export const Ep01RapportDePouvoir = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const f = (ms: number) => Math.round(ms / 1000 * fps);
  const bounds = SCENES.map((s) => f(startMsOf(s.id)));
  return (
    <AbsoluteFill style={{fontFamily: T.font, backgroundColor: C.bg0, color: C.text}}>
      <Background />
      {/* audio (voix off retiree a la demande: montage seul, musique + sfx) */}
      <Audio src={staticFile('media/ep01/music-bed.wav')} volume={0.18} />
      {/* sfx (restrained) */}
      <Sfx at={f(startMsOf(1)) - 3} src="media/ep01/impact-low.wav" volume={0.32} />
      <Sfx at={f(startMsOf(2)) - 4} src="media/ep01/whoosh-short.wav" volume={0.28} />
      <Sfx at={f(startMsOf(10))} src="media/ep01/success-chime.wav" volume={0.22} />
      <Sfx at={f(startMsOf(12)) - 4} src="media/ep01/whoosh-short.wav" volume={0.24} />
      <Sfx at={f(startMsOf(18)) - 3} src="media/ep01/impact-low.wav" volume={0.24} />
      <Sfx at={f(startMsOf(27)) - 4} src="media/ep01/success-chime.wav" volume={0.2} />
      {/* scenes */}
      {SCENES.map((s, i) => {
        const from = bounds[i];
        const to = i + 1 < bounds.length ? bounds[i + 1] : durationInFrames;
        const Comp = s.C;
        return (
          <Sequence key={s.id} from={from} durationInFrames={Math.max(1, to - from)}>
            <Comp />
          </Sequence>
        );
      })}
      <Chrome />
    </AbsoluteFill>
  );
};
