import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
if (!fs.existsSync(dist)) {
	console.error('[pagefind] dist/ missing');
	process.exit(1);
}
const nested404 = path.join(dist, '404', 'index.html');
if (fs.existsSync(nested404)) {
	fs.copyFileSync(nested404, path.join(dist, '404.html'));
}

const r = spawnSync('pnpm', ['exec', 'pagefind', '--site', 'dist', '--output-path', 'dist/pagefind'], {
	cwd: root,
	stdio: 'inherit',
	shell: true,
});
process.exit(r.status ?? 1);
