import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.join(__dirname, '..');

function readPagefindVersion() {
	const pkgPath = path.join(siteRoot, 'node_modules', 'pagefind', 'package.json');
	if (!fs.existsSync(pkgPath)) {
		console.error('[site] pagefind not found: run pnpm install first');
		process.exit(1);
	}
	return JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version;
}

/**
 * 与 `astro.config.ts` 中 dev 中间件读取目录、`pagefind-loader` 请求的 UI 脚本一致。
 * 缺少时搜索 UI 无法加载，故以此为就绪判据。
 */
function pagefindDevAssetsReady() {
	const version = readPagefindVersion();
	const sentinel = path.join(siteRoot, 'dist', 'pagefind', version, 'pagefind-component-ui.js');
	return fs.existsSync(sentinel);
}

if (!pagefindDevAssetsReady()) {
	console.log('[site] Pagefind dev assets missing; running pnpm build first…');
	const r = spawnSync('pnpm', ['run', 'build'], {
		cwd: siteRoot,
		stdio: 'inherit',
		shell: false,
	});
	if (r.status !== 0) {
		process.exit(r.status === null ? 1 : r.status);
	}
}

const child = spawn('pnpm', ['exec', 'astro', 'dev'], {
	cwd: siteRoot,
	stdio: 'inherit',
	shell: false,
});

child.on('error', (err) => {
	console.error(err);
	process.exit(1);
});

child.on('exit', (code, signal) => {
	if (signal) process.exit(1);
	process.exit(code ?? 0);
});
