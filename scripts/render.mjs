import {run, freshOutput} from './media-lib.mjs';
import {resolve} from 'node:path';
import {createServer} from 'node:net';
const [composition = 'CareerDemo', output = 'output/demo-master.mp4'] = process.argv.slice(2);
freshOutput(output);
const port = await new Promise((resolvePort, reject) => {
  const server = createServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    if (!address || typeof address === 'string') return reject(new Error('Could not reserve a render port'));
    server.close(() => resolvePort(address.port));
  });
});
const args = [resolve('node_modules/@remotion/cli/remotion-cli.js'), 'render', 'src/index.ts', composition, output,
  '--codec=h264', '--crf=18', '--pixel-format=yuv420p', '--concurrency=2', `--port=${port}`, '--timeout=120000'];
if (process.env.REMOTION_BROWSER_EXECUTABLE) args.push(`--browser-executable=${process.env.REMOTION_BROWSER_EXECUTABLE}`);
run(process.execPath, args, {stdio: 'inherit'});
