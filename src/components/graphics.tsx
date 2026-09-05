import type {CSSProperties, ReactNode} from 'react';
import {Check, AlertTriangle, ArrowRight} from 'lucide-react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, videoProgress} from '../utilities/timeline';
import {theme} from '../styles/theme';

export const Entrance = ({children, delay = 0, style}: {children: ReactNode; delay?: number; style?: CSSProperties}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const value = spring({frame: frame - Math.round(delay * fps), fps, config: theme.spring});
  return <div style={{opacity: clamp(value), translate: `0 ${interpolate(value, [0, 1], [32, 0])}px`, ...style}}>{children}</div>;
};

export const KineticText = ({text, size = 76, accent}: {text: string; size?: number; accent?: string}) =>
  <div style={{display: 'flex', flexWrap: 'wrap', columnGap: 18, rowGap: 3, fontSize: size,
    lineHeight: 1.14, fontWeight: 750, letterSpacing: 0}}>
    {text.split(' ').map((word, i) => <Entrance key={`${i}-${word}`} delay={i * 0.07}>
      <span style={{color: word === accent ? theme.colors.teal : undefined}}>{word}</span>
    </Entrance>)}
  </div>;

export const ProgressCircle = ({frame, durationInFrames, size = 72}: {frame: number; durationInFrames: number; size?: number}) => {
  const radius = size / 2 - 5, length = 2 * Math.PI * radius;
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Video progress">
    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={theme.colors.line} strokeWidth={5}/>
    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={theme.colors.teal} strokeWidth={5}
      strokeDasharray={length} strokeDashoffset={length * (1 - videoProgress(frame, durationInFrames))}
      transform={`rotate(-90 ${size / 2} ${size / 2})`}/>
  </svg>;
};

export const ProgressBar = ({value, color = theme.colors.teal}: {value: number; color?: string}) =>
  <div style={{height: 12, width: '100%', background: theme.colors.line, overflow: 'hidden'}}>
    <div style={{width: `${clamp(value) * 100}%`, height: '100%', background: color}}/>
  </div>;

export const Counter = ({to, suffix = '', delay = 0}: {to: number; suffix?: string; delay?: number}) => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const p = clamp(spring({fps, frame: frame - delay * fps, config: {damping: 200}}));
  return <span style={{fontVariantNumeric: 'tabular-nums'}}>{Math.round(to * p)}{suffix}</span>;
};

export const InfoCard = ({title, children, delay = 0}: {title: string; children: ReactNode; delay?: number}) =>
  <Entrance delay={delay} style={{padding: 34, background: theme.colors.white, border: `2px solid ${theme.colors.line}`,
    borderRadius: 8, minHeight: 180}}>
    <div style={{fontSize: 27, fontWeight: 650, color: theme.colors.muted, marginBottom: 18}}>{title}</div>
    {children}
  </Entrance>;

export const Comparison = ({items}: {items: {label: string; value: number}[]}) => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  return <div style={{display: 'grid', gap: 22}}>{items.map((item, i) =>
    <InfoCard key={item.label} title={item.label} delay={i * 0.15}>
      <div style={{fontSize: 76, fontWeight: 750, marginBottom: 20, color: i ? theme.colors.coral : theme.colors.teal}}>
        <Counter to={item.value} suffix="%" delay={i * 0.15}/>
      </div>
      <ProgressBar color={i ? theme.colors.coral : theme.colors.teal}
        value={item.value / 100 * clamp(spring({frame: frame - i * fps * 0.15, fps, config: {damping: 200}}))}/>
    </InfoCard>)}</div>;
};

export const Checklist = ({items}: {items: string[]}) => <div style={{display: 'grid', gap: 30}}>
  {items.map((text, i) => <Entrance key={text} delay={i * 0.18} style={{display: 'flex', alignItems: 'center', gap: 24, fontSize: 36}}>
    <Check size={40} color={theme.colors.teal} style={{flexShrink: 0}}/><span>{text}</span>
  </Entrance>)}
</div>;

export const Callout = ({children, warning = false, delay = 0}: {children: ReactNode; warning?: boolean; delay?: number}) =>
  <Entrance delay={delay} style={{display: 'flex', gap: 20, alignItems: 'center', padding: '24px 0', borderTop: `2px solid ${theme.colors.line}`, fontSize: 32}}>
    {warning ? <AlertTriangle size={36} color={theme.colors.coral}/> : <ArrowRight size={36} color={theme.colors.teal}/>}
    <div style={{flex: 1}}>{children}</div>
  </Entrance>;
