import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { parseNavYml } from './parse-nav-yml.mjs';
import { HOME_STEM, docPath, withBase } from '../src/lib/docPath.ts';
import { appI18nLocales } from '../src/lib/locales.ts';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmpDir = path.join(root, 'tmp');
const contentDir = path.join(tmpDir, 'content');
const docsJsonPath = path.join(tmpDir, 'docs.json');
const localeSuffixes = [...appI18nLocales];

function walkMarkdown(dir, acc = []) {
	if (!fs.existsSync(dir)) return acc;
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, ent.name);
		if (ent.isDirectory()) walkMarkdown(p, acc);
		else if (ent.isFile() && ent.name.endsWith('.md')) acc.push(p);
	}
	return acc;
}

function parseFileName(relPosix) {
	for (const loc of localeSuffixes) {
		const suffix = `.${loc}.md`;
		if (relPosix.endsWith(suffix)) {
			return { locale: loc, stem: relPosix.slice(0, -suffix.length) };
		}
	}
	return null;
}

function hasScheme(url) {
	return /^[a-zA-Z][a-zA-Z0-9+.-]*:/u.test(url);
}

/** 相对链接按仓库文件路径解析（含 `.{locale}.md`），再写成站点路径 */
function rewriteHref(href, locale, stem) {
	if (!href || hasScheme(href) || href.startsWith('#') || href.startsWith('/')) return href;
	const hashIndex = href.indexOf('#');
	const pathPart = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
	const hash = hashIndex >= 0 ? href.slice(hashIndex) : '';
	if (!pathPart.startsWith('./') && !pathPart.startsWith('../')) return href;
	const dir = path.posix.dirname(stem);
	let joined = path.posix.normalize(path.posix.join(dir === '.' ? '' : dir, pathPart));
	joined = joined.replace(/\\/g, '/');
	if (joined.startsWith('..') || joined.startsWith('/')) return href;
	const parsed = parseFileName(joined);
	const destStem = parsed ? parsed.stem : joined.endsWith('.md') ? joined.slice(0, -3) : joined;
	const destLocale = parsed?.locale ?? locale;
	return `${withBase(docPath(destLocale, destStem), process.env.SITE_BASE || '/')}${hash}`;
}

function rewriteHtmlLinks(html, locale, stem) {
	return html.replace(/href="([^"]+)"/g, (all, href) => {
		const next = rewriteHref(href, locale, stem);
		return next === href ? all : `href="${next}"`;
	});
}

function stripTags(s) {
	return s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function extractHeadings(html) {
	const headings = [];
	const re = /<h([2-4])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
	let m;
	while ((m = re.exec(html))) {
		const depth = Number(m[1]);
		const attrs = m[2] ?? '';
		const idMatch = attrs.match(/\bid="([^"]+)"/i);
		const text = stripTags(m[3] ?? '');
		const slug = idMatch?.[1] ?? text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
		if (slug && text) headings.push({ depth, slug, text });
	}
	return headings;
}

const navYmlPath = path.join(contentDir, 'nav.yml');
if (!fs.existsSync(navYmlPath)) {
	console.error(`[prepare-docs] missing ${navYmlPath} (run fetch-docs first)`);
	process.exit(1);
}
const navSpec = parseNavYml(fs.readFileSync(navYmlPath, 'utf8'));

const files = walkMarkdown(contentDir)
	.map((abs) => {
		const rel = path.relative(contentDir, abs).split(path.sep).join('/');
		const parsed = parseFileName(rel);
		if (!parsed) return null;
		const raw = fs.readFileSync(abs, 'utf8');
		const fm = matter(raw);
		const title = String(fm.data.title ?? parsed.stem);
		return {
			id: `${parsed.locale}:${parsed.stem}`,
			locale: parsed.locale,
			stem: parsed.stem,
			title,
			description: fm.data.description ? String(fm.data.description) : undefined,
			markdown: `# ${title}\n\n${fm.content.replace(/^\uFEFF/, '').replace(/^\s+/, '')}`,
		};
	})
	.filter(Boolean);

if (files.length === 0) {
	console.error(`[prepare-docs] no markdown under ${contentDir} (run fetch-docs first)`);
	process.exit(1);
}

const input = {
	files: files.map((f) => ({ id: f.id, markdown: f.markdown })),
};
const toolDir = path.join(root, 'scripts', 'md2html');
const built = path.join(tmpDir, process.platform === 'win32' ? 'md2html.exe' : 'md2html');
fs.mkdirSync(path.dirname(built), { recursive: true });
const build = spawnSync('go', ['build', '-o', built, '.'], { cwd: toolDir, stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);

const run = spawnSync(built, [], {
	input: JSON.stringify(input),
	encoding: 'utf8',
	maxBuffer: 32 * 1024 * 1024,
});
if (run.status !== 0) {
	console.error(run.stderr);
	process.exit(run.status ?? 1);
}

const luteOut = JSON.parse(run.stdout);
const htmlById = new Map(luteOut.files.map((f) => [f.id, f.html]));

const docs = files.map((f) => {
	const html = rewriteHtmlLinks(htmlById.get(f.id) ?? '', f.locale, f.stem);
	return {
		locale: f.locale,
		stem: f.stem,
		title: f.title,
		description: f.description,
		html,
		headings: extractHeadings(html),
		markdown: f.markdown.trim(),
	};
});

const nav = Object.fromEntries(localeSuffixes.map((locale) => [locale, []]));
for (const locale of localeSuffixes) {
	const byStem = new Map(docs.filter((d) => d.locale === locale).map((d) => [d.stem, d]));
	for (const entry of navSpec) {
		if (!entry.pages) {
			const doc = byStem.get(entry.key);
			if (!doc) continue;
			nav[locale].push({ type: 'page', stem: doc.stem, title: doc.title });
			continue;
		}
		const items = [];
		for (const page of entry.pages) {
			const stem = page.includes('/') ? page : `${entry.key}/${page}`;
			const doc = byStem.get(stem);
			if (!doc) continue;
			items.push({ stem: doc.stem, title: doc.title });
		}
		if (items.length === 0) continue;
		nav[locale].push({
			type: 'group',
			key: entry.key,
			label: entry.labels[locale] ?? entry.labels.en ?? entry.key,
			items,
		});
	}
}

const payload = {
	docs: docs.map(({ markdown, html, ...doc }) => doc),
	nav,
};

fs.mkdirSync(tmpDir, { recursive: true });
fs.writeFileSync(docsJsonPath, `${JSON.stringify(payload, null, '\t')}\n`);

const docHtmlDir = path.join(tmpDir, 'doc-html');
const pagefindSrc = path.join(tmpDir, 'pagefind-source');
const publicDir = path.join(root, 'public');
fs.rmSync(docHtmlDir, { recursive: true, force: true });
fs.rmSync(pagefindSrc, { recursive: true, force: true });
for (const loc of localeSuffixes) {
	fs.rmSync(path.join(publicDir, loc), { recursive: true, force: true });
	fs.rmSync(path.join(publicDir, `${loc}.md`), { force: true }); // 旧版语言根 `/en.md`
}

const loaderEntries = [];
for (const doc of docs) {
	const jsonAbs = `${path.join(docHtmlDir, doc.locale, ...doc.stem.split('/'))}.json`;
	fs.mkdirSync(path.dirname(jsonAbs), { recursive: true });
	fs.writeFileSync(jsonAbs, `${JSON.stringify({ html: doc.html })}\n`);
	const key = `${doc.locale}:${doc.stem}`;
	const rel = `./doc-html/${doc.locale}/${doc.stem}.json`;
	loaderEntries.push(`\t${JSON.stringify(key)}: () => import(${JSON.stringify(rel)})`);

	const mdAbs = `${path.join(publicDir, doc.locale, ...doc.stem.split('/'))}.md`;
	fs.mkdirSync(path.dirname(mdAbs), { recursive: true });
	const body = doc.markdown.endsWith('\n') ? doc.markdown : `${doc.markdown}\n`;
	fs.writeFileSync(mdAbs, body, 'utf8');

	const parts = doc.stem === HOME_STEM ? [doc.locale] : [doc.locale, ...doc.stem.split('/')];
	const pfAbs = path.join(pagefindSrc, ...parts, 'index.html');
	fs.mkdirSync(path.dirname(pfAbs), { recursive: true });
	const title = escapeHtml(doc.title);
	fs.writeFileSync(
		pfAbs,
		`<!DOCTYPE html>\n<html lang="${doc.locale}"><head><meta charset="utf-8"><title>${title}</title></head><body><main data-pagefind-body>${doc.html}</main></body></html>\n`,
	);
}
fs.writeFileSync(
	path.join(tmpDir, 'doc-html-loaders.js'),
	`export const loaders = {\n${loaderEntries.join(',\n')},\n};\n`,
);

console.log(`[prepare-docs] wrote ${docs.length} pages to tmp/docs.json, tmp/doc-html, and public markdown`);

if (process.argv.includes('--skip-pagefind')) {
	console.log('[prepare-docs] skip Pagefind index (--skip-pagefind)');
} else {
	const pagefind = spawnSync(process.execPath, [path.join(root, 'scripts', 'run-pagefind.mjs'), '--dev'], {
		cwd: root,
		stdio: 'inherit',
	});
	if (pagefind.status !== 0) process.exit(pagefind.status ?? 1);
}
