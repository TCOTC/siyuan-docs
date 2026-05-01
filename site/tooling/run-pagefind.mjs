import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sitePkgRoot = path.join(__dirname, '..');
const pkgPath = path.join(sitePkgRoot, 'node_modules', 'pagefind', 'package.json');
const version = JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version;
const outputSubdir = `pagefind/${version}`;

const result = spawnSync(
	'pnpm',
	['exec', 'pagefind', '--site', 'dist', '--output-subdir', outputSubdir],
	{
		cwd: sitePkgRoot,
		stdio: 'inherit',
		shell: false,
	},
);

process.exit(result.status === null ? 1 : result.status);
