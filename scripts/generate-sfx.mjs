import {mkdirSync, writeFileSync, existsSync} from 'node:fs';
import {resolve} from 'node:path';

const rate = 48000;
const out = resolve(process.argv[2] || 'public/demo/sfx');
mkdirSync(out, {recursive: true});
let seed = 47;
const noise = () => ((seed = seed * 48271 % 2147483647) / 2147483647) * 2 - 1;
const sounds = [
  {name: 'click-soft', seconds: 0.12, make: (t, p) => Math.sin(2 * Math.PI * 950 * t) * Math.exp(-p * 13) * 0.35},
  {name: 'impact-low', seconds: 0.65, make: (t, p) => (Math.sin(2 * Math.PI * (72 - 34 * p) * t) * 0.8 + noise() * 0.12) * Math.exp(-p * 5)},
  {name: 'whoosh-short', seconds: 0.48, make: (t, p) => noise() * Math.sin(Math.PI * p) * (0.08 + p * 0.2)},
  {name: 'success-chime', seconds: 0.75, make: (t, p) => (Math.sin(2 * Math.PI * 523.25 * t) + 0.55 * Math.sin(2 * Math.PI * 659.25 * t)) * Math.exp(-p * 3.5) * 0.23},
  {name: 'music-bed', seconds: 14.4, make: (t, p) => {
    const fade = Math.min(1, t / 1.2, (14.4 - t) / 1.2);
    const pulse = 0.65 + 0.35 * Math.sin(2 * Math.PI * 2 * t);
    return (Math.sin(2 * Math.PI * 110 * t) + 0.55 * Math.sin(2 * Math.PI * 138.59 * t) + 0.35 * Math.sin(2 * Math.PI * 164.81 * t)) * 0.035 * pulse * fade;
  }},
];

const wav = (samples) => {
  const pcm = Buffer.alloc(samples.length * 2);
  samples.forEach((value, i) => pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF'); header.writeUInt32LE(36 + pcm.length, 4); header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24); header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
  header.write('data', 36); header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
};

for (const sound of sounds) {
  const path = resolve(out, `${sound.name}.wav`);
  if (existsSync(path)) continue;
  const count = Math.round(sound.seconds * rate);
  writeFileSync(path, wav(Array.from({length: count}, (_, i) => sound.make(i / rate, i / count))), {flag: 'wx'});
}
console.log(`Generated ${sounds.length} original 48 kHz mono sounds in ${out}`);
