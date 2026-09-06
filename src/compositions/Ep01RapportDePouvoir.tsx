import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill, Sequence, Img, interpolate, spring, useCurrentFrame, useVideoConfig, staticFile,
} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {fade} from '@remotion/transitions/fade';
import {wipe} from '@remotion/transitions/wipe';
import {
  Brain, Building2, User, Clock, Wrench, FlaskConical, Trophy, TrendingUp, Check, X, ArrowRight,
  HelpCircle, AlertTriangle, Handshake, Heart, Share2, MessageCircle, Bell, Sparkles, Target,
  Lightbulb, Briefcase, Search, Users, Puzzle, ClipboardList, UserCheck, MessageSquare,
} from 'lucide-react';
import {ep01 as T} from '../styles/ep01Theme';
import timeline from '../../public/media/ep01/timeline.json';

const C = T.colors;
const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const fr = timeline as {fragments: {index: number; startMs: number; endMs: number; text: string}[]; totalMs: number};
const startMsOf = (i: number) => fr.fragments.find((f) => f.index === i)!.startMs;

// ---------- primitives ----------
const useReveal = (delaySec = 0, cfg: {damping?: number; stiffness?: number; mass?: number} = T.spring) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return clamp(spring({frame: frame - Math.round(delaySec * fps), fps, config: cfg}));
};

const Reveal = ({children, delay = 0, y = 34, style}: {children: ReactNode; delay?: number; y?: number; style?: CSSProperties}) => {
  const v = useReveal(delay);
  return <div style={{opacity: v, transform: `translateY(${interpolate(v, [0, 1], [y, 0])}px)`, ...style}}>{children}</div>;
};

const Kicker = ({children, color = C.indigo, delay = 0}: {children: ReactNode; color?: string; delay?: number}) => (
  <Reveal delay={delay}>
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 27, fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', color}}>
      <span style={{width: 34, height: 4, background: color, borderRadius: 2}} />{children}
    </div>
  </Reveal>
);

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

const Headline = ({text, size = 84, accent = C.indigo, delay = 0, lineHeight = 1.08}: {
  text: string; size?: number; accent?: string; delay?: number; lineHeight?: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = parseAccent(text);
  return (
    <div style={{fontSize: size, fontWeight: 820, lineHeight, letterSpacing: -1, color: C.ink}}>
      {words.map((w, i) => {
        const v = clamp(spring({frame: frame - Math.round((delay + i * 0.05) * fps), fps, config: {damping: 20, stiffness: 170, mass: 0.8}}));
        return (
          <span key={i} style={{display: 'inline-block', marginRight: '0.26em', opacity: v, transform: `translateY(${interpolate(v, [0, 1], [24, 0])}px)`, color: w.accent ? accent : C.ink}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const Card = ({children, delay = 0, style, accent}: {children: ReactNode; delay?: number; style?: CSSProperties; accent?: string}) => {
  const v = useReveal(delay);
  return (
    <div style={{opacity: v, transform: `translateY(${interpolate(v, [0, 1], [30, 0])}px)`, background: C.card, border: `1px solid ${C.cardBorder}`, borderLeft: accent ? `6px solid ${accent}` : `1px solid ${C.cardBorder}`, borderRadius: 20, boxShadow: '0 18px 40px rgba(34,48,58,0.08)', ...style}}>
      {children}
    </div>
  );
};

const Chip = ({icon, label, delay = 0, color = C.indigo, soft = C.indigoSoft}: {icon: ReactNode; label: string; delay?: number; color?: string; soft?: string}) => (
  <Card delay={delay} style={{display: 'flex', alignItems: 'center', gap: 22, padding: '22px 26px'}}>
    <div style={{width: 62, height: 62, borderRadius: 16, background: soft, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0}}>{icon}</div>
    <span style={{fontSize: 40, fontWeight: 700, color: C.ink}}>{label}</span>
  </Card>
);

// Balance / scale on a light background. tilt: -1 (left down) .. +1 (right down)
const Balance = ({tilt, size = 420, leftColor = C.green, rightColor = C.amber}: {tilt: number; size?: number; leftColor?: string; rightColor?: string}) => {
  const w = size, h = size * 0.86;
  const cx = w / 2, pivotY = h * 0.16, beam = w * 0.78, drop = h * 0.34;
  const ang = (tilt * 11) * Math.PI / 180;
  const end = (dir: number) => ({x: cx + dir * Math.cos(ang) * beam / 2, y: pivotY + dir * Math.sin(ang) * beam / 2});
  const L = end(-1), R = end(1);
  const pan = (p: {x: number; y: number}, color: string) => (
    <g>
      <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + drop} stroke={C.line} strokeWidth={3} />
      <path d={`M ${p.x - 54} ${p.y + drop} A 54 30 0 0 0 ${p.x + 54} ${p.y + drop} Z`} fill={color} opacity={0.14} />
      <path d={`M ${p.x - 54} ${p.y + drop} A 54 30 0 0 0 ${p.x + 54} ${p.y + drop} Z`} fill="none" stroke={color} strokeWidth={6} />
      <circle cx={p.x} cy={p.y} r={7} fill={color} />
    </g>
  );
  return (
    <svg width={w} height={h + 20} viewBox={`0 0 ${w} ${h + 20}`}>
      <rect x={cx - 70} y={h - 10} width={140} height={12} rx={6} fill={C.inkSoft} opacity={0.5} />
      <rect x={cx - 7} y={pivotY} width={14} height={h - pivotY - 8} rx={7} fill={C.inkSoft} opacity={0.55} />
      <line x1={L.x} y1={L.y} x2={R.x} y2={R.y} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
      <circle cx={cx} cy={pivotY} r={13} fill={C.ink} />
      {pan(L, leftColor)}
      {pan(R, rightColor)}
    </svg>
  );
};

const sfxFile: Record<string, string> = {whoosh: 'whoosh-short.wav', impact: 'impact-low.wav', chime: 'success-chime.wav', click: 'click-soft.wav'};
const EntrySfx = ({sound, volume = 0.3}: {sound: keyof typeof sfxFile; volume?: number}) => (
  <Sequence from={0} durationInFrames={48}><Audio src={staticFile('media/ep01/' + sfxFile[sound])} volume={volume} /></Sequence>
);

const Scene = ({children, sfx = 'whoosh', justify = 'center', style}: {children: ReactNode; sfx?: keyof typeof sfxFile; justify?: CSSProperties['justifyContent']; style?: CSSProperties}) => (
  <AbsoluteFill style={{padding: `${T.safe.top + 40}px ${T.safe.x}px ${T.safe.bottom + 20}px`, display: 'flex', flexDirection: 'column', justifyContent: justify, gap: 38, ...style}}>
    <EntrySfx sound={sfx} volume={sfx === 'impact' ? 0.34 : sfx === 'whoosh' ? 0.28 : 0.2} />
    {children}
  </AbsoluteFill>
);

// ---------- scenes ----------
const S_Intro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const boomAt = Math.round(1.7 * fps);
  const boom = clamp(spring({frame: frame - boomAt, fps, config: {damping: 12, stiffness: 150, mass: 0.7}}));
  const brain = useReveal(0.15, {damping: 12, stiffness: 130, mass: 0.8});
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 26, padding: `0 ${T.safe.x}px`}}>
      <EntrySfx sound="impact" volume={0.34} />
      <div style={{opacity: brain, transform: `scale(${interpolate(brain, [0, 1], [0.7, 1])})`, width: 190, height: 190, borderRadius: 46, background: C.indigoSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Brain size={110} color={C.indigo} strokeWidth={1.7} />
      </div>
      <Kicker delay={0.5}>Psychologie du recrutement</Kicker>
      <div style={{transform: `scale(${interpolate(boom, [0, 1], [0.7, 1])})`, textAlign: 'center', marginTop: 6}}>
        <div style={{fontSize: 112, fontWeight: 880, letterSpacing: -3, lineHeight: 0.98, color: C.ink}}>LE RAPPORT</div>
        <div style={{fontSize: 112, fontWeight: 880, letterSpacing: -3, lineHeight: 0.98, color: C.indigo}}>DE POUVOIR</div>
      </div>
      <div style={{marginTop: 20, opacity: clamp((frame - boomAt - 8) / 12)}}>
        <Balance tilt={interpolate(boom, [0, 1], [0, 0.9])} size={330} />
      </div>
      <Reveal delay={2.4}>
        <div style={{padding: '13px 30px', background: C.ink, color: C.paper, borderRadius: 999, fontSize: 29, fontWeight: 800, letterSpacing: 3}}>ÉPISODE 1</div>
      </Reveal>
    </AbsoluteFill>
  );
};

const S_LowPower = () => (
  <Scene sfx="whoosh">
    <Kicker delay={0} color={C.coral}>Le point de départ</Kicker>
    <Headline text="En entretien, le candidat se sent en position de *faiblesse*." size={80} accent={C.coral} delay={0.15} />
    <Reveal delay={1.0} style={{alignSelf: 'center', marginTop: 10}}>
      <Balance tilt={0.85} size={400} />
    </Reveal>
    <Reveal delay={1.4}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 800, letterSpacing: 2}}>
        <span style={{color: C.green}}>VOUS</span><span style={{color: C.amber}}>L'ENTREPRISE</span>
      </div>
    </Reveal>
  </Scene>
);

const S_Why = () => (
  <Scene sfx="click">
    <Kicker delay={0}>Pourquoi ce ressenti</Kicker>
    <div style={{display: 'grid', gap: 22, marginTop: 6}}>
      <Chip icon={<Target size={34} />} label="Il veut le poste" delay={0.2} color={C.amber} soft={C.amberSoft} />
      <Chip icon={<UserCheck size={34} />} label="Il sait qu'il est évalué" delay={0.5} color={C.amber} soft={C.amberSoft} />
      <Chip icon={<Building2 size={34} />} label="L'entreprise détient la décision" delay={0.8} color={C.amber} soft={C.amberSoft} />
    </div>
  </Scene>
);

const S_Perception = () => (
  <Scene sfx="whoosh">
    <Headline text="Et cette *perception* change sa façon de se présenter." size={86} accent={C.indigo} />
    <Reveal delay={1.0} style={{alignSelf: 'center', marginTop: 10}}>
      <div style={{width: 200, height: 200, borderRadius: 50, background: C.indigoSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Brain size={130} color={C.indigo} strokeWidth={1.5} />
      </div>
    </Reveal>
  </Scene>
);

const S_Study = () => (
  <Scene sfx="whoosh">
    <Kicker delay={0} color={C.green}>Ce que dit la recherche</Kicker>
    <Card delay={0.25} accent={C.green} style={{padding: 42}}>
      <div style={{width: 96, height: 96, borderRadius: 24, background: C.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <FlaskConical size={56} color={C.green} strokeWidth={1.8} />
      </div>
      <div style={{fontSize: 30, color: C.inkSoft, marginTop: 24, fontWeight: 700}}>Étude publiée dans le</div>
      <div style={{fontSize: 50, fontWeight: 820, marginTop: 8, lineHeight: 1.1, color: C.ink}}>Journal of Experimental Social Psychology</div>
    </Card>
  </Scene>
);

const GroupCard = ({title, sub, level, color, soft, delay}: {title: string; sub: string; level: number; color: string; soft: string; delay: number}) => {
  const v = useReveal(delay);
  return (
    <div style={{flex: 1, opacity: v, transform: `translateY(${interpolate(v, [0, 1], [30, 0])}px)`, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 20, boxShadow: '0 14px 30px rgba(34,48,58,0.07)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center', textAlign: 'center'}}>
      <div style={{fontSize: 28, fontWeight: 820, color}}>{title}</div>
      <div style={{display: 'flex', gap: 8, alignItems: 'flex-end', height: 116}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{width: 24, borderRadius: 6, background: i < level ? color : soft, height: `${40 + i * 40}%`}} />
        ))}
      </div>
      <div style={{fontSize: 25, color: C.inkSoft, fontWeight: 650}}>{sub}</div>
    </div>
  );
};

const S_Groups = () => (
  <Scene sfx="whoosh">
    <Kicker delay={0}>L'expérience : 3 groupes</Kicker>
    <div style={{display: 'flex', gap: 18, marginTop: 6}}>
      <GroupCard title="Pouvoir" sub="souvenir fort" level={3} color={C.green} soft={C.greenSoft} delay={0.3} />
      <GroupCard title="Peu" sub="souvenir faible" level={1} color={C.coral} soft={C.coralSoft} delay={0.6} />
      <GroupCard title="Neutre" sub="témoin" level={2} color={C.inkSoft} soft="rgba(34,48,58,0.10)" delay={0.9} />
    </div>
    <Reveal delay={1.3}>
      <div style={{fontSize: 32, color: C.inkSoft, textAlign: 'center', fontWeight: 650}}>Chacun se remémore une situation avant l'entretien.</div>
    </Reveal>
  </Scene>
);

const S_Result = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = clamp(spring({frame: frame - Math.round(0.3 * fps), fps, config: {damping: 12, stiffness: 140}}));
  return (
    <Scene sfx="impact">
      <Reveal><div style={{display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 850, letterSpacing: 4, color: C.green, textTransform: 'uppercase'}}><Sparkles size={32} /> Résultat</div></Reveal>
      <Headline text="Se sentir en position de *pouvoir*..." size={74} accent={C.green} delay={0.2} />
      <div style={{display: 'grid', gap: 20, marginTop: 4}}>
        {[{icon: <Trophy size={40} />, label: 'davantage préférés'}, {icon: <TrendingUp size={40} />, label: 'perçus plus persuasifs'}].map((it, i) => {
          const v = clamp(spring({frame: frame - Math.round((0.7 + i * 0.25) * fps), fps, config: T.spring}));
          return (
            <div key={i} style={{opacity: v, transform: `translateX(${interpolate(v, [0, 1], [40, 0])}px)`, display: 'flex', alignItems: 'center', gap: 22, padding: '24px 28px', background: C.greenSoft, border: `1px solid ${C.green}`, borderRadius: 16}}>
              <div style={{color: C.green}}>{it.icon}</div>
              <span style={{fontSize: 44, fontWeight: 800, color: C.ink}}>{it.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{transform: `scale(${interpolate(pop, [0, 1], [0.9, 1])})`, opacity: pop, alignSelf: 'center', marginTop: 4}}>
        <Trophy size={70} color={C.green} />
      </div>
    </Scene>
  );
};

const S_Influence = () => (
  <Scene sfx="whoosh">
    <Headline text="Votre *perception* influence la façon dont on vous perçoit." size={82} accent={C.indigo} />
  </Scene>
);

const S_KeyIdea = () => (
  <Scene sfx="impact">
    <Kicker delay={0} color={C.green}>À retenir</Kicker>
    <Headline text="Le recruteur, *lui aussi*, a un besoin." size={92} accent={C.green} delay={0.2} />
    <Reveal delay={1.0} style={{alignSelf: 'center', marginTop: 12}}>
      <Balance tilt={0} size={400} />
    </Reveal>
  </Scene>
);

const NeedColumn = ({title, icon, items, color, soft, delay}: {title: string; icon: ReactNode; items: {icon: ReactNode; label: string}[]; color: string; soft: string; delay: number}) => {
  const v = useReveal(delay);
  return (
    <div style={{flex: 1, opacity: v, transform: `translateY(${interpolate(v, [0, 1], [30, 0])}px)`, background: C.card, border: `1px solid ${C.cardBorder}`, borderTop: `6px solid ${color}`, borderRadius: 18, boxShadow: '0 14px 30px rgba(34,48,58,0.07)', padding: 28, display: 'flex', flexDirection: 'column', gap: 20}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, color}}>
        <div style={{width: 54, height: 54, borderRadius: 14, background: soft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{icon}</div>
        <span style={{fontSize: 30, fontWeight: 850, letterSpacing: 1}}>{title}</span>
      </div>
      {items.map((it, i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, fontSize: 31, fontWeight: 650, color: C.ink}}>
          <span style={{color}}>{it.icon}</span>{it.label}
        </div>
      ))}
    </div>
  );
};

const S_TwoNeeds = () => (
  <Scene sfx="whoosh">
    <Kicker delay={0}>Un échange, pas un examen</Kicker>
    <div style={{display: 'flex', gap: 18, marginTop: 4}}>
      <NeedColumn title="L'ENTREPRISE" icon={<Building2 size={30} />} color={C.amber} soft={C.amberSoft} delay={0.3}
        items={[{icon: <Target size={26} />, label: 'un poste à pourvoir'}, {icon: <Wrench size={26} />, label: 'un problème'}, {icon: <Check size={26} />, label: 'des compétences'}]} />
      <NeedColumn title="VOUS" icon={<User size={30} />} color={C.green} soft={C.greenSoft} delay={0.7}
        items={[{icon: <Brain size={26} />, label: 'des compétences'}, {icon: <Clock size={26} />, label: 'du temps'}, {icon: <TrendingUp size={26} />, label: 'de l\'énergie'}]} />
    </div>
  </Scene>
);

const S_Reframe = () => (
  <Scene sfx="click">
    <Card delay={0.1} accent={C.coral} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '26px 28px'}}>
      <X size={44} color={C.coral} style={{flexShrink: 0}} />
      <span style={{fontSize: 40, fontWeight: 700, color: C.inkSoft, textDecoration: 'line-through', textDecorationColor: C.coral}}>« Je dois absolument les convaincre »</span>
    </Card>
    <Reveal delay={0.7} style={{alignSelf: 'center'}}><ArrowRight size={64} color={C.inkSoft} style={{transform: 'rotate(90deg)'}} /></Reveal>
    <Card delay={1.1} accent={C.green} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '26px 28px'}}>
      <Check size={44} color={C.green} style={{flexShrink: 0}} />
      <span style={{fontSize: 40, fontWeight: 780, color: C.ink}}>« Ils ont un besoin. Est-ce que j'y réponds ? »</span>
    </Card>
  </Scene>
);

const S_Question = () => {
  const v = useReveal(0.2, {damping: 12, stiffness: 140});
  return (
    <Scene sfx="impact">
      <Kicker delay={0} color={C.amber}>La question redoutée</Kicker>
      <div style={{opacity: v, transform: `scale(${interpolate(v, [0, 1], [0.9, 1])})`, padding: 46, background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 24, boxShadow: '0 20px 44px rgba(34,48,58,0.10)', position: 'relative'}}>
        <div style={{position: 'absolute', top: -34, left: 36, width: 68, height: 68, borderRadius: 18, background: C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><HelpCircle size={40} color={C.card} /></div>
        <div style={{fontSize: 72, fontWeight: 830, lineHeight: 1.1, color: C.ink, marginTop: 22}}>« Pourquoi vous, plutôt qu'un autre&nbsp;? »</div>
      </div>
    </Scene>
  );
};

const S_TwoModes = () => (
  <Scene sfx="whoosh">
    <Reveal delay={0.15}>
      <div style={{padding: 30, borderRadius: 18, background: C.coralSoft, border: `1px solid ${C.coral}`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, color: C.coral, fontWeight: 850, fontSize: 29, marginBottom: 12}}><AlertTriangle size={32} /> SI VOUS VOUS SENTEZ ÉVALUÉ</div>
        <div style={{fontSize: 38, fontWeight: 700, color: C.ink}}>Vous paniquez, vous voulez surconvaincre.</div>
      </div>
    </Reveal>
    <Reveal delay={0.7} style={{alignSelf: 'center'}}><ArrowRight size={52} color={C.inkSoft} style={{transform: 'rotate(90deg)'}} /></Reveal>
    <Reveal delay={1.0}>
      <div style={{padding: 30, borderRadius: 18, background: C.greenSoft, border: `1px solid ${C.green}`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, color: C.green, fontWeight: 850, fontSize: 29, marginBottom: 12}}><Handshake size={32} /> DANS UN RAPPORT ÉQUILIBRÉ</div>
        <div style={{fontSize: 38, fontWeight: 700, color: C.ink}}>Vous montrez comment vous résolvez son problème.</div>
      </div>
    </Reveal>
  </Scene>
);

const S_Remember = () => (
  <Scene sfx="whoosh">
    <Kicker delay={0} color={C.amber}>La prochaine fois</Kicker>
    <Headline text="Vous n'arrivez pas *les mains vides*." size={88} accent={C.amber} delay={0.2} />
    <Reveal delay={1.0}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 40, fontWeight: 700, color: C.ink}}>
        <Check size={40} color={C.green} /> Vous avez ce dont elle a besoin.
      </div>
    </Reveal>
  </Scene>
);

const S_Collab = () => (
  <Scene sfx="whoosh">
    <Reveal style={{alignSelf: 'center'}} delay={0.1}>
      <div style={{width: 200, height: 200, borderRadius: 50, background: C.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Handshake size={120} color={C.green} strokeWidth={1.5} /></div>
    </Reveal>
    <Headline text="Une *discussion* entre deux parties." size={84} accent={C.green} delay={0.4} />
    <Reveal delay={1.1}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 36, fontWeight: 650, color: C.inkSoft}}>
        <X size={32} color={C.coral} /> pas un examen à réussir.
      </div>
    </Reveal>
  </Scene>
);

const S_Cta = () => {
  const actions = [{icon: <Bell size={36} />, label: 'Abonne-toi'}, {icon: <Heart size={36} />, label: "J'aime"}, {icon: <Share2 size={36} />, label: 'Partage'}, {icon: <MessageCircle size={36} />, label: 'Commente'}];
  return (
    <Scene sfx="chime">
      <div style={{alignSelf: 'center'}}><Reveal delay={0}><div style={{width: 150, height: 150, borderRadius: 40, background: C.indigoSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Brain size={92} color={C.indigo} strokeWidth={1.6} /></div></Reveal></div>
      <Headline text="Des conseils pour *réussir* tes entretiens." size={72} accent={C.indigo} delay={0.3} />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 8}}>
        {actions.map((a, i) => {
          const v = useReveal(0.6 + i * 0.16);
          return (
            <div key={i} style={{opacity: v, transform: `scale(${interpolate(v, [0, 1], [0.85, 1])})`, display: 'flex', alignItems: 'center', gap: 16, padding: '24px 22px', background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, boxShadow: '0 12px 26px rgba(34,48,58,0.07)', color: C.indigo}}>
              {a.icon}<span style={{fontSize: 34, fontWeight: 780, color: C.ink}}>{a.label}</span>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

// ---------- schedule ----------
const SCENES: {id: number; C: () => ReactNode}[] = [
  {id: 0, C: S_Intro}, {id: 2, C: S_LowPower}, {id: 3, C: S_Why}, {id: 4, C: S_Perception},
  {id: 5, C: S_Study}, {id: 6, C: S_Groups}, {id: 10, C: S_Result}, {id: 11, C: S_Influence},
  {id: 12, C: S_KeyIdea}, {id: 14, C: S_TwoNeeds}, {id: 16, C: S_Reframe}, {id: 18, C: S_Question},
  {id: 20, C: S_TwoModes}, {id: 22, C: S_Remember}, {id: 25, C: S_Collab}, {id: 27, C: S_Cta},
];

const FPS = 30;
const TRANS = 18;
const starts = SCENES.map((s) => startMsOf(s.id));
const durFrames = SCENES.map((s, i) => {
  const endMs = i + 1 < SCENES.length ? starts[i + 1] : fr.totalMs;
  return Math.max(45, Math.round((endMs - starts[i]) / 1000 * FPS)) + TRANS;
});
export const EP01_FPS = FPS;
export const EP01_TOTAL = durFrames.reduce((a, b) => a + b, 0) - TRANS * (SCENES.length - 1);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transitionFor = (i: number): any => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const presets: any[] = [slide({direction: 'from-right'}), fade(), slide({direction: 'from-bottom'}), wipe({direction: 'from-left'}), slide({direction: 'from-left'}), fade(), slide({direction: 'from-bottom'})];
  return presets[i % presets.length];
};

// ---------- background + chrome ----------
const doodles: {Icon: typeof Brain; x: number; y: number; s: number; r: number}[] = [
  {Icon: Brain, x: 6, y: 12, s: 150, r: -12}, {Icon: Briefcase, x: 78, y: 8, s: 130, r: 10},
  {Icon: Lightbulb, x: 84, y: 30, s: 120, r: 6}, {Icon: Search, x: 4, y: 40, s: 120, r: -8},
  {Icon: MessageSquare, x: 80, y: 62, s: 130, r: 12}, {Icon: Users, x: 6, y: 66, s: 140, r: 8},
  {Icon: Puzzle, x: 82, y: 84, s: 130, r: -10}, {Icon: ClipboardList, x: 8, y: 88, s: 120, r: 9},
  {Icon: Target, x: 46, y: 4, s: 110, r: 0}, {Icon: Handshake, x: 44, y: 92, s: 120, r: 0},
];

const PaperBackground = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Img src={staticFile('media/ep01/paper.png')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9}} />
      {doodles.map((d, i) => {
        const dx = Math.sin((frame + i * 40) / 130) * 10;
        const dy = Math.cos((frame + i * 55) / 150) * 10;
        const Icon = d.Icon;
        return (
          <div key={i} style={{position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, transform: `translate(${dx}px, ${dy}px) rotate(${d.r}deg)`, color: C.ink, opacity: 0.05}}>
            <Icon size={d.s} strokeWidth={1.5} />
          </div>
        );
      })}
      {/* very light top wash, no glow rays */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,255,255,0.35), transparent 30%)'}} />
    </AbsoluteFill>
  );
};

const Header = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = clamp(frame / (durationInFrames - 1));
  return (
    <>
      <div style={{position: 'absolute', top: 66, left: T.safe.x, right: T.safe.x, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, color: C.ink}}>
          <div style={{width: 46, height: 46, borderRadius: 12, background: C.indigoSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Brain size={28} color={C.indigo} /></div>
          <span style={{fontSize: 27, fontWeight: 850, letterSpacing: 1}}>Psychologie du recrutement</span>
        </div>
      </div>
      <div style={{position: 'absolute', top: 124, left: T.safe.x, right: T.safe.x, display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{flex: 1, height: 6, background: 'rgba(34,48,58,0.12)', borderRadius: 3, overflow: 'hidden'}}>
          <div style={{width: `${p * 100}%`, height: '100%', background: C.indigo, borderRadius: 3}} />
        </div>
        <span style={{fontSize: 24, fontWeight: 800, color: C.inkSoft, letterSpacing: 2}}>ÉP.01</span>
      </div>
    </>
  );
};

export const Ep01RapportDePouvoir = () => (
  <AbsoluteFill style={{fontFamily: T.font, backgroundColor: C.paper, color: C.ink}}>
    <PaperBackground />
    <Audio src={staticFile('media/ep01/music-bed.wav')} volume={0.16} />
    <TransitionSeries>
      {SCENES.flatMap((s, i) => {
        const Comp = s.C;
        const seq = (
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={durFrames[i]}>
            <Comp />
          </TransitionSeries.Sequence>
        );
        if (i === 0) return [seq];
        return [
          <TransitionSeries.Transition key={`t${i}`} presentation={transitionFor(i)} timing={linearTiming({durationInFrames: TRANS})} />,
          seq,
        ];
      })}
    </TransitionSeries>
    <Header />
  </AbsoluteFill>
);
