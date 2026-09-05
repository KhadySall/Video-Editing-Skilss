import {useMemo} from 'react';
import type {Caption as Word} from '@remotion/captions';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {captionPages} from '../utilities/timeline';
import {theme} from '../styles/theme';

export const Caption = ({words, highlight = true}: {words: Word[]; highlight?: boolean}) => {
  const frame = useCurrentFrame(), {fps} = useVideoConfig();
  const timeMs = frame / fps * 1000;
  const pages = useMemo(() => captionPages(words), [words]);
  const page = pages.find(p => timeMs >= p.startMs && timeMs < p.endMs);
  if (!page) return null;
  const longest = Math.max(...page.words.map(w => w.text.trim().length));
  const size = Math.min(51, Math.floor(720 / Math.max(1, longest * 0.65)));
  return <div style={{position: 'absolute', left: theme.safe.left, right: theme.safe.right,
    bottom: theme.safe.bottom, minHeight: 148, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{background: theme.colors.ink, color: theme.colors.white, padding: '22px 30px',
      borderRadius: 6, maxWidth: '100%', textAlign: 'center', fontSize: size, lineHeight: 1.35,
      fontWeight: 650, letterSpacing: 0, overflowWrap: 'anywhere'}}>
      {page.words.map((word, index) => <span key={`${word.startMs}-${index}`} style={{
        color: highlight && timeMs >= word.startMs && timeMs < word.endMs ? '#79E0C8' : undefined}}>
        {index > 0 ? ' ' : ''}{word.text.trim()}
      </span>)}
    </div>
  </div>;
};
