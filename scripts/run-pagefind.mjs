import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const isDev = process.argv.includes('--dev');

function runPagefind(site, outputPath) {
	const r = spawnSync('pnpm', ['exec', 'pagefind', '--site', site, '--output-path', outputPath], {
		cwd: root,
		stdio: 'inherit',
		shell: true,
	});
	return r.status ?? 1;
}

if (isDev) {
	const site = path.join(root, 'tmp', 'pagefind-source');
	if (!fs.existsSync(site)) {
		console.error('[pagefind] tmp/pagefind-source missing (run prepare-docs)');
		process.exit(1);
	}
	process.exit(runPagefind(path.join('tmp', 'pagefind-source'), path.join('tmp', 'pagefind')));
}

const dist = path.join(root, 'dist');
if (!fs.existsSync(dist)) {
	console.error('[pagefind] dist/ missing');
	process.exit(1);
}
const nested404 = path.join(dist, '404', 'index.html');
if (fs.existsSync(nested404)) {
	fs.copyFileSync(nested404, path.join(dist, '404.html'));
}

process.exit(runPagefind('dist', path.join('dist', 'pagefind')));
