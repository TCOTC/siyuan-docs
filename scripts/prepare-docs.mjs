import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'content');
const generatedDir = path.join(root, 'src', 'generated');
const localeSuffixes = ['en', 'zh-CN'];
const navKeys = ['intro', 'plugin', 'theme', 'bazaar', 'icons', 'templates', 'widgets'];

const navLabels = {
	en: {
		intro: 'Introduction',
		plugin: 'Plugins',
		theme: 'Themes',
		bazaar: 'Marketplace',
		icons: 'Icon packs',
		templates: 'Templates',
		widgets: 'Widgets',
	},
	'zh-CN': {
		intro: '入门',
		plugin: '插件',
		theme: '主题',
		bazaar: '集市与发布',
		icons: '图标包',
		templates: '模板',
		widgets: '挂件',
	},
};

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
	if (joined.endsWith('.md')) joined = joined.slice(0, -3);
	const base = process.env.SITE_BASE || '/';
	const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${prefix}/${locale}/${joined}/${hash}`;
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

function navGroupKey(stem) {
	const first = stem.split('/')[0] ?? '';
	return navKeys.includes(first) ? first : 'intro';
}

const files = walkMarkdown(contentDir)
	.map((abs) => {
		const rel = path.relative(contentDir, abs).split(path.sep).join('/');
		const parsed = parseFileName(rel);
		if (!parsed) return null;
		const raw = fs.readFileSync(abs, 'utf8');
		const fm = matter(raw);
		return {
			id: `${parsed.locale}:${parsed.stem}`,
			locale: parsed.locale,
			stem: parsed.stem,
			sourcePath: rel,
			title: String(fm.data.title ?? parsed.stem),
			description: fm.data.description ? String(fm.data.description) : undefined,
			order: typeof fm.data.order === 'number' ? fm.data.order : 99,
			markdown: fm.content.replace(/^\uFEFF/, ''),
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
const toolDir = path.join(root, 'tools', 'md2html');
const built = path.join(root, 'tmp', process.platform === 'win32' ? 'md2html.exe' : 'md2html');
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
		order: f.order,
		html,
		headings: extractHeadings(html),
		sourcePath: f.sourcePath,
		markdown: f.markdown.trim(),
	};
});

const nav = { en: [], 'zh-CN': [] };
for (const locale of localeSuffixes) {
	const scoped = docs.filter((d) => d.locale === locale);
	for (const key of navKeys) {
		const items = scoped
			.filter((d) => navGroupKey(d.stem) === key)
			.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
			.map((d) => ({ stem: d.stem, title: d.title }));
		if (items.length === 0) continue;
		nav[locale].push({ key, label: navLabels[locale][key], items });
	}
}

const payload = {
	docs,
	nav,
	homeStem: 'intro/welcome',
};

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(path.join(generatedDir, 'docs.json'), `${JSON.stringify(payload, null, '\t')}\n`);
console.log(`[prepare-docs] wrote ${docs.length} pages`);
