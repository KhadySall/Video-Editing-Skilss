import {resolve, join} from 'node:path';
import {mkdirSync} from 'node:fs';
import {binary, run, ffmpeg, probe, readJson, freshOutput, writeJson, normalize, loudness} from './media-lib.mjs';
import {validateEdit} from '../src/utilities/timeline.ts';

const [command, input, output, extra] = process.argv.slice(2);
if (command === 'doctor') {
  for (const name of ['ffmpeg', 'ffprobe']) console.log(run(binary(name), ['-version']).stdout.split('\n')[0]);
  console.log(`Node ${process.version}`);
} else if (command === 'inspect') {
  const data = probe(input);
  if (output) writeJson(freshOutput(output, input), data);
  console.log(JSON.stringify(data, null, 2));
} else if (command === 'extract-audio') {
  ffmpeg(['-n', '-i', resolve(input), '-map', '0:a:0', '-vn', '-ac', '1', '-ar', '16000',
    '-c:a', 'pcm_s16le', freshOutput(output, input)]);
} else if (command === 'silence') {
  const durationMs = Number(probe(input).format.duration) * 1000;
  const {stderr} = ffmpeg(['-i', resolve(input), '-map', '0:a:0', '-af',
    'silencedetect=noise=-35dB:d=0.65', '-vn', '-f', 'null', '-']);
  const candidates = [];
  let startMs = null;
  for (const match of stderr.matchAll(/silence_(start|end):\s*([\d.]+)/g)) {
    if (match[1] === 'start') startMs = Number(match[2]) * 1000;
    else if (startMs !== null) {
      candidates.push({startMs, endMs: Number(match[2]) * 1000, action: 'review'});
      startMs = null;
    }
  }
  if (startMs !== null) candidates.push({startMs, endMs: durationMs, action: 'review'});
  writeJson(freshOutput(output, input), {thresholdDb: -35, minimumMs: 650, candidates});
  console.log(`${candidates.length} candidate pauses. These are not automatic cuts.`);
} else if (command === 'cut') {
  // Usage: cut input.mp4 edit.json output.mp4. All graph values come from validated numbers.
  const edit = readJson(output);
  validateEdit(edit);
  const meta = probe(input);
  if (Math.abs(Number(meta.format.duration) * 1000 - edit.sourceDurationMs) > 100) throw new Error('Edit duration differs from media');
  if (!meta.streams.some(s => s.codec_type === 'audio')) throw new Error('Speech editing requires an audio stream');
  const video = meta.streams.some(s => s.codec_type === 'video');
  const destination = freshOutput(extra, input);
  const graph = [];
  const labels = [];
  for (const [i, k] of edit.keep.entries()) {
    const start = k.startMs / 1000, end = k.endMs / 1000;
    if (video) graph.push(`[0:v:0]trim=start=${start}:end=${end},setpts=PTS-STARTPTS[v${i}]`);
    graph.push(`[0:a:0]atrim=start=${start}:end=${end},asetpts=PTS-STARTPTS[a${i}]`);
    labels.push(`${video ? `[v${i}]` : ''}[a${i}]`);
  }
  graph.push(`${labels.join('')}concat=n=${edit.keep.length}:v=${video ? 1 : 0}:a=1${video ? '[v]' : ''}[a]`);
  const args = ['-n', '-i', resolve(input), '-filter_complex', graph.join(';')];
  if (video) args.push('-map', '[v]', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-fps_mode', 'vfr');
  args.push('-map', '[a]', '-ar', '48000');
  if (destination.toLowerCase().endsWith('.wav')) args.push('-c:a', 'pcm_s16le');
  else args.push('-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart');
  ffmpeg([...args, destination]);
  console.log(JSON.stringify(probe(destination).format, null, 2));
} else if (command === 'normalize') {
  console.log(JSON.stringify(normalize(input, output), null, 2));
} else if (command === 'qc') {
  const directory = resolve(output || 'output/qc');
  mkdirSync(directory, {recursive: true});
  const reportPath = freshOutput(join(directory, 'report.json'));
  const meta = probe(input);
  const video = meta.streams.find(s => s.codec_type === 'video');
  const audio = meta.streams.find(s => s.codec_type === 'audio');
  const duration = Number(meta.format.duration);
  const errors = [];
  if (!video || video.width !== 1080 || video.height !== 1920 || video.codec_name !== 'h264' || video.pix_fmt !== 'yuv420p') errors.push('Expected 1080x1920 H.264 yuv420p');
  if (!audio || audio.codec_name !== 'aac') errors.push('Expected AAC audio');
  if (!Number.isFinite(duration) || duration <= 0) errors.push('Invalid duration');
  if (extra && Math.abs(duration - Number(extra)) > 0.1) errors.push('Unexpected duration');
  if (video && audio && Math.abs(Number(video.duration) - Number(audio.duration)) > 0.1) errors.push('A/V duration mismatch');
  const decode = ffmpeg(['-v', 'error', '-xerror', '-i', resolve(input), '-f', 'null', '-']);
  if (decode.stderr.trim()) errors.push(`Decode errors: ${decode.stderr}`);
  const levels = audio ? loudness(input) : null;
  if (levels && (Number(levels.input_i) < -18 || Number(levels.input_i) > -14 || Number(levels.input_tp) > -1)) errors.push('Loudness outside project target (-16 +/-2 LUFS, <=-1 dBTP)');
  const frames = [];
  if (video) {
    const rateParts = video.avg_frame_rate.split('/').map(Number);
    const fps = rateParts[0] / rateParts[1];
    const videoDuration = Number(video.duration || duration);
    const times = [0, 0.5, videoDuration * 0.25, videoDuration * 0.5, videoDuration * 0.75, Math.max(0, videoDuration - 0.2)];
    for (const [i, time] of times.entries()) {
      const path = freshOutput(join(directory, `frame-${i}.png`));
      ffmpeg(['-v', 'error', '-n', '-ss', String(time), '-i', resolve(input), '-frames:v', '1', path]);
      if (!(await import('node:fs')).existsSync(path)) errors.push(`Could not extract frame at ${time}s`);
      frames.push({time, path});
    }
  }
  const black = video ? ffmpeg(['-i', resolve(input), '-vf', 'blackdetect=d=0.1:pix_th=0.10', '-an', '-f', 'null', '-']).stderr.match(/black_start:[^\r\n]+/g) || [] : [];
  const report = {input: resolve(input), technicalPass: errors.length === 0, errors, duration,
    video, audio, levels, blackSegments: black, frames,
    visualReview: 'PENDING: open extracted frames, inspect transitions and watch with sound before delivery'};
  writeJson(reportPath, report);
  console.log(JSON.stringify(report, null, 2));
  if (errors.length) process.exitCode = 1;
} else {
  console.log('Commands: doctor | inspect INPUT [JSON] | extract-audio INPUT WAV | silence INPUT JSON | cut INPUT EDIT_JSON OUTPUT | normalize INPUT MP4 | qc MP4 QC_DIR [EXPECTED_SECONDS]');
  process.exitCode = 1;
}
