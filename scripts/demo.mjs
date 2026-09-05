import {run} from './media-lib.mjs';
run(process.execPath, ['scripts/demo-assets.mjs'], {stdio: 'inherit'});
run(process.execPath, ['scripts/render.mjs'], {stdio: 'inherit'});
run(process.execPath, ['--experimental-strip-types', 'scripts/media.mjs', 'normalize', 'output/demo-master.mp4', 'output/demo-final.mp4'], {stdio: 'inherit'});
run(process.execPath, ['--experimental-strip-types', 'scripts/media.mjs', 'qc', 'output/demo-final.mp4', 'output/demo-qc', '14.4'], {stdio: 'inherit'});
console.log('Technical pipeline finished. Visual review and listening are still required.');
