import {cpSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {run} from './media-lib.mjs';
const commit = 'f54682712abc4a68cdc7c41513bd3b3298829873';
const source = resolve(process.argv[2] || '.cache/remotion-skills');
const destination = resolve('.claude/skills/remotion-best-practices');
if (existsSync(destination)) throw new Error('Official skill already installed; preserve local changes and review upgrades manually');
if (!existsSync(source)) {
  mkdirSync('.cache', {recursive: true});
  run('git', ['clone', 'https://github.com/remotion-dev/skills.git', source]);
  run('git', ['-C', source, 'checkout', '--detach', commit]);
}
const actual = run('git', ['-C', source, 'rev-parse', 'HEAD']).stdout.trim();
if (actual !== commit) throw new Error(`Expected audited revision ${commit}, found ${actual}`);
mkdirSync('.claude/skills', {recursive: true});
cpSync(resolve(source, 'skills/remotion-best-practices'), destination, {recursive: true, errorOnExist: true});
writeFileSync(resolve(destination, 'UPSTREAM.txt'), `Locally installed from https://github.com/remotion-dev/skills\nRevision ${commit}\nNot relicensed or redistributed by this project.\n`);
console.log(`Installed official Remotion skill unchanged at ${commit}`);
