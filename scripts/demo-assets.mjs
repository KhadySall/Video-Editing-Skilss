import {mkdirSync, writeFileSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {run, ffmpeg, probe, readJson} from './media-lib.mjs';
mkdirSync('public/demo', {recursive: true});
run(process.execPath, ['scripts/generate-sfx.mjs'], {stdio: 'inherit'});
if (existsSync('public/demo/transcript.json') && existsSync('public/demo/voice.wav')) {
  console.log('Demo assets already present.');
  process.exit(0);
}
const sentences = ['A CV has no universal score.', 'The match changes with the job.', 'Tailor your evidence to the role.'];
const starts = [600, 5100, 9800];
let words = [], mode = 'synthetic timing tones';
if (process.platform === 'win32' && !existsSync('public/demo/line-0.wav')) {
  try {
    run('C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', ['-NoProfile', '-File', resolve('scripts/demo-voice.ps1')]);
  } catch (error) { console.warn(`Offline system speech unavailable: ${error.message}`); }
}
if (sentences.every((_, i) => existsSync(`public/demo/line-${i}.wav`) && existsSync(`public/demo/line-${i}.json`))) {
  mode = 'Windows offline system speech with SpeakProgress timestamps';
  for (let i = 0; i < sentences.length; i++) {
    const data = JSON.parse((await import('node:fs')).readFileSync(`public/demo/line-${i}.json`, 'utf8').replace(/^\uFEFF/, ''));
    const duration = Number(probe(`public/demo/line-${i}.wav`).format.duration) * 1000;
    if (duration > 4200) throw new Error('Demo voice exceeds allotted scene; adjust narration speed or timing');
    words.push(...data.map((word, j) => ({text: word.text,
      startMs: Math.round(starts[i] + word.startMs),
      endMs: Math.round(starts[i] + (data[j + 1]?.startMs ?? duration)),
      timestampMs: Math.round(starts[i] + word.startMs), confidence: null,
      pageBreakAfter: j === data.length - 1})));
  }
  ffmpeg(['-n', '-i', 'public/demo/line-0.wav', '-i', 'public/demo/line-1.wav', '-i', 'public/demo/line-2.wav',
    '-filter_complex', '[0:a]adelay=600:all=1[a];[1:a]adelay=5100:all=1[b];[2:a]adelay=9800:all=1[c];[a][b][c]amix=inputs=3:normalize=0,apad=whole_dur=14.4[out]',
    '-map', '[out]', '-t', '14.4', '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', 'public/demo/voice.wav']);
} else {
  const sampleRate = 48000, count = Math.round(14.4 * sampleRate);
  const pcm = Buffer.alloc(count * 2);
  sentences.forEach((sentence, i) => sentence.split(' ').forEach((text, j) => {
    const startMs = starts[i] + j * 420, endMs = startMs + 330;
    words.push({text, startMs, endMs, timestampMs: startMs, confidence: null});
    for (let k = 0; k < 0.33 * sampleRate; k++) {
      const t = k / sampleRate;
      const value = Math.sin(2 * Math.PI * (220 + j * 30) * t) * Math.sin(Math.PI * t / 0.33) * 0.2;
      pcm.writeInt16LE(Math.round(value * 32767), (Math.round(startMs / 1000 * sampleRate) + k) * 2);
    }
  }));
  const header = Buffer.alloc(44);
  header.write('RIFF'); header.writeUInt32LE(36 + pcm.length, 4); header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24); header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(pcm.length, 40);
  writeFileSync('public/demo/voice.wav', Buffer.concat([header, pcm]), {flag: 'wx'});
}
writeFileSync('public/demo/transcript.json', JSON.stringify({version: 1, timebase: 'source', language: 'en',
  durationMs: 14400, fixture: mode, words}, null, 2), {flag: 'wx'});
console.log(`Demo assets ready: ${mode}`);
