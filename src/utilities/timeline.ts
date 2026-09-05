import type {Caption} from '@remotion/captions';

export type Transcript = {
  version: 1; timebase: 'source' | 'edited'; language: string;
  durationMs: number; words: Caption[];
};
export type Keep = {startMs: number; endMs: number; reason: string};
export type Edit = {version: 1; sourceDurationMs: number; keep: Keep[]};
export const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const videoProgress = (frame: number, duration: number) =>
  clamp(frame / Math.max(1, duration - 1));

export function validateTranscript(t: Transcript): void {
  if (t.version !== 1 || !['source', 'edited'].includes(t.timebase) ||
    !Number.isFinite(t.durationMs) || t.durationMs <= 0 || !Array.isArray(t.words)) {
    throw new Error('Invalid transcript metadata');
  }
  let previousEnd = 0;
  for (const w of t.words) {
    if (!w.text?.trim() || !Number.isFinite(w.startMs) || !Number.isFinite(w.endMs) ||
      w.startMs < previousEnd || w.endMs <= w.startMs || w.endMs > t.durationMs + 1) {
      throw new Error(`Invalid or overlapping word: ${JSON.stringify(w)}`);
    }
    previousEnd = w.endMs;
  }
}

export function validateEdit(edit: Edit): void {
  if (edit.version !== 1 || !Number.isFinite(edit.sourceDurationMs) ||
    edit.sourceDurationMs <= 0 || !Array.isArray(edit.keep) || !edit.keep.length) {
    throw new Error('An edit must retain at least one interval');
  }
  let end = 0;
  for (const k of edit.keep) {
    if (!Number.isFinite(k.startMs) || !Number.isFinite(k.endMs) || k.startMs < end ||
      k.endMs <= k.startMs || k.endMs > edit.sourceDurationMs || !k.reason?.trim()) {
      throw new Error('Keep intervals must be ordered, disjoint, bounded and justified');
    }
    end = k.endMs;
  }
}

export function remapTranscript(source: Transcript, edit: Edit): Transcript {
  validateTranscript(source);
  validateEdit(edit);
  if (source.timebase !== 'source') throw new Error('Refusing to remap an already edited transcript');
  if (Math.abs(source.durationMs - edit.sourceDurationMs) > 1) throw new Error('Source duration mismatch');
  const words: Caption[] = [];
  let offset = 0;
  for (const keep of edit.keep) {
    for (const w of source.words) {
      if (w.endMs <= keep.startMs || w.startMs >= keep.endMs) continue;
      if (w.startMs < keep.startMs || w.endMs > keep.endMs) {
        throw new Error(`Cut crosses spoken word "${w.text.trim()}"; move the boundary or re-transcribe`);
      }
      words.push({...w, startMs: offset + w.startMs - keep.startMs,
        endMs: offset + w.endMs - keep.startMs,
        timestampMs: w.timestampMs === null ? null : offset + w.timestampMs - keep.startMs});
    }
    offset += keep.endMs - keep.startMs;
  }
  return {...source, timebase: 'edited', durationMs: offset, words};
}

export type CaptionPage = {startMs: number; endMs: number; words: Caption[]};
export function captionPages(words: Caption[], maxWords = 5, maxChars = 28): CaptionPage[] {
  if (!Number.isInteger(maxWords) || maxWords < 1 || maxChars < 1) throw new Error('Invalid caption limits');
  const pages: CaptionPage[] = [];
  let current: Caption[] = [];
  const flush = () => {
    if (current.length) pages.push({startMs: current[0].startMs,
      endMs: current[current.length - 1].endMs, words: current});
    current = [];
  };
  for (const w of words) {
    const prev = current[current.length - 1];
    if (prev && (current.length >= maxWords || w.startMs - prev.endMs > 450 ||
      current.map(x => x.text.trim()).join(' ').length + w.text.trim().length + 1 > maxChars)) flush();
    current.push(w);
    if (/[.!?]$/.test(w.text.trim()) || w.pageBreakAfter) flush();
  }
  flush();
  for (let i = 1; i < pages.length; i++) {
    const previous = pages[i - 1];
    const currentPage = pages[i];
    if (currentPage.words.length === 1 && previous.words.length > 2 &&
      currentPage.startMs - previous.endMs <= 450 && !/[.!?]$/.test(previous.words.at(-1)?.text.trim() ?? '')) {
      const moved = previous.words.pop();
      if (moved) {
        currentPage.words.unshift(moved);
        currentPage.startMs = moved.startMs;
        previous.endMs = previous.words.at(-1)?.endMs ?? previous.endMs;
      }
    }
  }
  return pages;
}

export function toSrt(pages: CaptionPage[]): string {
  const time = (ms: number) => {
    const n = Math.round(ms);
    return `${String(Math.floor(n / 3600000)).padStart(2, '0')}:${String(Math.floor(n / 60000) % 60).padStart(2, '0')}:${String(Math.floor(n / 1000) % 60).padStart(2, '0')},${String(n % 1000).padStart(3, '0')}`;
  };
  return pages.map((p, i) => `${i + 1}\n${time(p.startMs)} --> ${time(p.endMs)}\n${p.words.map(w => w.text.trim()).join(' ')}\n`).join('\n');
}
