import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync, realpathSync} from 'node:fs';
import {resolve, dirname, relative, isAbsolute} from 'node:path';

export function binary(name) {
  const configured = process.env[`${name.toUpperCase()}_PATH`];
  if (configured) return configured;
  const local = resolve('.tools', 'ffmpeg', 'bin', `${name}${process.platform === 'win32' ? '.exe' : ''}`);
  return existsSync(local) ? local : name;
}
export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {encoding: 'utf8', windowsHide: true,
    maxBuffer: 64 * 1024 * 1024, ...options});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}):\n${result.stderr || result.stdout}`);
  return result;
}
export const ffmpeg = args => run(binary('ffmpeg'), ['-hide_banner', '-nostdin', ...args]);
export const probe = input => JSON.parse(run(binary('ffprobe'),
  ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', resolve(input)]).stdout);
export const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
export function freshOutput(path, input) {
  if (!path) throw new Error('Output path is required');
  const destination = resolve(path);
  if (input && resolve(input).toLowerCase() === destination.toLowerCase()) throw new Error('Cannot overwrite source');
  if (existsSync(destination)) throw new Error(`Output exists; choose a revision filename: ${path}`);
  mkdirSync(dirname(destination), {recursive: true});
  // Resolve the existing parent to reject output symlinks into the source directory.
  const parent = realpathSync(dirname(destination));
  const sourceRoot = realpathSync('input');
  const rel = relative(sourceRoot, parent);
  if (rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))) throw new Error('Outputs cannot be written under input/');
  return destination;
}
export const writeJson = (path, data) => writeFileSync(path, JSON.stringify(data, null, 2) + '\n', {flag: 'wx'});
export function loudness(input) {
  const {stderr} = ffmpeg(['-i', resolve(input), '-map', '0:a:0', '-af',
    'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-vn', '-f', 'null', '-']);
  const block = stderr.match(/\{\s*"input_i"[\s\S]*?\}/g)?.at(-1);
  if (!block) throw new Error('No loudness measurements returned');
  const result = JSON.parse(block);
  if (!['input_i', 'input_tp', 'input_lra', 'input_thresh', 'target_offset'].every(k => Number.isFinite(Number(result[k])))) {
    throw new Error('Silent or unmeasurable audio; cannot normalize');
  }
  return result;
}
export function normalize(input, output) {
  const destination = freshOutput(output, input);
  const m = loudness(input);
  const hasVideo = probe(input).streams.some(stream => stream.codec_type === 'video');
  const filter = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true:print_format=json`;
  const args = ['-n', '-i', resolve(input)];
  if (hasVideo) args.push('-map', '0:v:0', '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p',
    '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-color_range', 'tv',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709');
  args.push('-map', '0:a:0', '-af', filter, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k');
  if (hasVideo) args.push('-movflags', '+faststart');
  ffmpeg([...args, destination]);
  return {before: m, after: loudness(destination)};
}
