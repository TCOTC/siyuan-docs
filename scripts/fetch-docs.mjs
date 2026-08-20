import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseNavYml } from './parse-nav-yml.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dest = path.join(root, 'tmp', 'content');
const localeSuffixes = ['en', 'zh-CN'];

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

function copyNavTree(src, entries) {
	const navFrom = path.join(src, 'nav.yml');
	if (!fs.existsSync(navFrom)) {
		console.error(`[fetch-docs] missing ${navFrom}`);
		process.exit(1);
	}
	fs.copyFileSync(navFrom, path.join(dest, 'nav.yml'));
	for (const entry of entries) {
		if (entry.pages) {
			const from = path.join(src, entry.key);
			if (!fs.existsSync(from)) continue;
			fs.cpSync(from, path.join(dest, entry.key), { recursive: true });
			continue;
		}
		for (const loc of localeSuffixes) {
			const name = `${entry.key}.${loc}.md`;
			const from = path.join(src, name);
			if (!fs.existsSync(from)) continue;
			fs.copyFileSync(from, path.join(dest, name));
		}
	}
}

function localMainWorktree() {
	try {
		const out = execSync('git worktree list --porcelain', { cwd: root, encoding: 'utf8' });
		let worktree = '';
		let branch = '';
		for (const line of `${out}\n`.split(/\r?\n/)) {
			if (line.startsWith('worktree ')) {
				worktree = line.slice('worktree '.length);
				branch = '';
			} else if (line.startsWith('branch ')) {
				branch = line.slice('branch '.length);
			} else if (line === '') {
				if (worktree && branch === 'refs/heads/main') return worktree;
				worktree = '';
				branch = '';
			}
		}
	} catch {
		/* ignore */
	}
	return null;
}

function readNavEntries(srcDir) {
	const navPath = path.join(srcDir, 'nav.yml');
	if (!fs.existsSync(navPath)) {
		console.error(`[fetch-docs] missing ${navPath}`);
		process.exit(1);
	}
	return parseNavYml(fs.readFileSync(navPath, 'utf8'));
}

const fromEnv = process.env.DOCS_DIR;
const fromWorktree = fromEnv ? null : localMainWorktree();
if (fromEnv || fromWorktree) {
	const src = path.resolve(fromEnv || fromWorktree);
	copyNavTree(src, readNavEntries(src));
	console.log(`[fetch-docs] copied from ${src}`);
	process.exit(0);
}

const tarPath = path.join(root, 'tmp', 'docs.tar');
fs.mkdirSync(path.dirname(tarPath), { recursive: true });
execSync('git fetch origin main', { cwd: root, stdio: 'inherit' });
const navText = execSync('git show origin/main:nav.yml', { cwd: root, encoding: 'utf8' });
const entries = parseNavYml(navText, 'origin/main:nav.yml');
const listed = new Set(
	execSync('git ls-tree --name-only origin/main', { cwd: root, encoding: 'utf8' })
		.split(/\r?\n/)
		.filter(Boolean),
);
const archivePaths = ['nav.yml'];
for (const entry of entries) {
	if (entry.pages) {
		if (listed.has(entry.key)) archivePaths.push(entry.key);
		continue;
	}
	for (const loc of localeSuffixes) {
		const name = `${entry.key}.${loc}.md`;
		if (listed.has(name)) archivePaths.push(name);
	}
}
execSync(`git archive --format=tar origin/main ${archivePaths.join(' ')} -o "${tarPath}"`, {
	cwd: root,
	stdio: 'inherit',
});
execSync(`tar -xf "${tarPath}" -C "${dest}"`, { cwd: root, stdio: 'inherit' });
fs.rmSync(tarPath, { force: true });
console.log('[fetch-docs] extracted origin/main docs into tmp/content/');
