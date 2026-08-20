import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dest = path.join(root, 'content');
const folders = ['bazaar', 'icons', 'intro', 'plugin', 'templates', 'theme', 'widgets'];

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

const fromEnv = process.env.DOCS_DIR;
if (fromEnv) {
	const src = path.resolve(fromEnv);
	for (const folder of folders) {
		const from = path.join(src, folder);
		if (!fs.existsSync(from)) continue;
		fs.cpSync(from, path.join(dest, folder), { recursive: true });
	}
	console.log(`[fetch-docs] copied from ${src}`);
	process.exit(0);
}

const tarPath = path.join(root, 'tmp', 'docs.tar');
fs.mkdirSync(path.dirname(tarPath), { recursive: true });
execSync('git fetch origin main', { cwd: root, stdio: 'inherit' });
execSync(`git archive --format=tar origin/main ${folders.join(' ')} -o "${tarPath}"`, {
	cwd: root,
	stdio: 'inherit',
});
execSync(`tar -xf "${tarPath}" -C "${dest}"`, { cwd: root, stdio: 'inherit' });
fs.rmSync(tarPath, { force: true });
console.log('[fetch-docs] extracted origin/main docs into content/');
