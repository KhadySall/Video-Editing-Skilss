import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, staticFile} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries, springTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {FileText, BriefcaseBusiness} from 'lucide-react';
import {Caption} from '../components/Caption';
import {KineticText, ProgressCircle, InfoCard, Comparison, Checklist, Callout} from '../components/graphics';
import {theme} from '../styles/theme';
import type {Transcript} from '../utilities/timeline';
import fixture from '../../public/demo/transcript.json';

const Scene = ({children}: {children: React.ReactNode}) => <AbsoluteFill style={{background: theme.colors.background,
  padding: `${theme.safe.top + 160}px ${theme.safe.right}px 540px ${theme.safe.left}px`, gap: 64}}>{children}</AbsoluteFill>;

const Hook = () => <Scene>
  <KineticText text="One CV. No universal score." accent="score."/>
  <InfoCard title="YOUR EXPERIENCE" delay={0.25}>
    <div style={{display: 'flex', alignItems: 'center', gap: 28, marginBottom: 38}}>
      <FileText size={66} color={theme.colors.teal}/><span style={{fontSize: 44, fontWeight: 700}}>Curriculum vitae</span>
    </div>
    {[0.85, 0.6, 0.73].map((width, i) => <div key={i} style={{height: 13, background: theme.colors.line, width: `${width * 100}%`, marginTop: 20}}/>)}
    <div style={{fontSize: 28, color: theme.colors.muted, marginTop: 42}}>Skills. Experience. Evidence.</div>
  </InfoCard>
  <Callout warning delay={0.55}>A score needs a reference point.</Callout>
</Scene>;

const Match = () => <Scene>
  <KineticText text="Different roles. Different matches." accent="matches." size={70}/>
  <Comparison items={[{label: 'ROLE A  /  PROJECT COORDINATOR', value: 82}, {label: 'ROLE B  /  DATA ANALYST', value: 54}]}/>
  <div style={{fontSize: 24, color: theme.colors.muted}}>Illustrative values, not an ATS prediction.</div>
</Scene>;

const Payoff = () => <Scene>
  <KineticText text="Make the match clear." accent="clear."/>
  <InfoCard title="A STRONGER APPLICATION" delay={0.2}>
    <BriefcaseBusiness size={58} color={theme.colors.teal} style={{marginBottom: 34}}/>
    <Checklist items={['Read the role carefully', 'Choose relevant evidence', 'Use accurate keywords']}/>
  </InfoCard>
  <Callout delay={0.65}>Tailor the evidence. Keep it honest.</Callout>
</Scene>;

export const CareerDemo = () => {
  const frame = useCurrentFrame(), {durationInFrames} = useVideoConfig();
  return <AbsoluteFill style={{fontFamily: theme.font, color: theme.colors.ink, letterSpacing: 0}}>
    <Audio src={staticFile('demo/voice.wav')}/>
    <Audio src={staticFile('demo/sfx/music-bed.wav')} volume={0.16}/>
    <Sequence from={8}><Audio src={staticFile('demo/sfx/impact-low.wav')} volume={0.28}/></Sequence>
    <Sequence from={134}><Audio src={staticFile('demo/sfx/whoosh-short.wav')} volume={0.32}/></Sequence>
    <Sequence from={281}><Audio src={staticFile('demo/sfx/whoosh-short.wav')} volume={0.32}/></Sequence>
    <Sequence from={326}><Audio src={staticFile('demo/sfx/success-chime.wav')} volume={0.22}/></Sequence>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={147}><Hook/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-right'})}
        timing={springTiming({durationInFrames: 9, config: {damping: 200}})}/>
      <TransitionSeries.Sequence durationInFrames={147}><Match/></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: 'from-right'})}
        timing={springTiming({durationInFrames: 9, config: {damping: 200}})}/>
      <TransitionSeries.Sequence durationInFrames={156}><Payoff/></TransitionSeries.Sequence>
    </TransitionSeries>
    <div style={{position: 'absolute', top: theme.safe.top, left: theme.safe.left, right: theme.safe.right,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 26, fontWeight: 650}}>
      <span>CAREER NOTES / 01</span><ProgressCircle frame={frame} durationInFrames={durationInFrames}/>
    </div>
    <Caption words={(fixture as Transcript).words}/>
  </AbsoluteFill>;
};
