import {test} from 'node:test';
import assert from 'node:assert/strict';
import {captionPages, remapTranscript, toSrt, validateEdit, videoProgress} from '../src/utilities/timeline.ts';
import type {Transcript} from '../src/utilities/timeline.ts';
const word = (text: string, startMs: number, endMs: number) => ({text, startMs, endMs, timestampMs: null, confidence: 1});
const source: Transcript = {version: 1, language: 'en', timebase: 'source', durationMs: 6000,
  words: [word('Keep', 200, 500), word('this.', 600, 1000), word('Next', 4000, 4300)]};
test('multiple cuts shift words and duration without inventing words in removed regions', () => {
  const result = remapTranscript(source, {version: 1, sourceDurationMs: 6000,
    keep: [{startMs: 0, endMs: 1200, reason: 'Hook'}, {startMs: 3800, endMs: 4500, reason: 'Next idea'}]});
  assert.equal(result.durationMs, 1900);
  assert.equal(result.words[2].startMs, 1400);
  assert.equal(result.timebase, 'edited');
});
test('cuts through phonemes and overlapping keep intervals are rejected', () => {
  assert.throws(() => remapTranscript(source, {version: 1, sourceDurationMs: 6000,
    keep: [{startMs: 300, endMs: 5000, reason: 'bad'}]}), /crosses/);
  assert.throws(() => validateEdit({version: 1, sourceDurationMs: 6000,
    keep: [{startMs: 0, endMs: 2000, reason: 'a'}, {startMs: 1000, endMs: 3000, reason: 'b'}]}));
});
test('caption pages respect punctuation, silence, and bounded word count', () => {
  const pages = captionPages(source.words);
  assert.equal(pages.length, 2);
  assert.equal(pages[0].endMs, 1000);
  assert.match(toSrt(pages), /00:00:00,200 --> 00:00:01,000\nKeep this\./);
});
test('caption pages avoid a single-word orphan when the previous page can rebalance', () => {
  const words = ['The', 'match', 'changes', 'with', 'the', 'job.'].map((text, i) => word(text, i * 300, i * 300 + 250));
  const pages = captionPages(words, 5, 28);
  assert.deepEqual(pages.map(page => page.words.length), [4, 2]);
});
test('whole-video progress uses the final displayed frame and stays bounded', () => {
  assert.equal(videoProgress(0, 360), 0);
  assert.equal(videoProgress(359, 360), 1);
  assert.equal(videoProgress(900, 360), 1);
});
