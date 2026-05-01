import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Definition, Link, Root } from 'mdast';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';
import { type AppLocale, appI18nLocales } from '../lib/appLocale';
import { developerDocPath } from '../lib/developerDocPath';

const localePathRe = appI18nLocales.map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

function developerDocPageHref(siteBase: string, locale: AppLocale, docRel: string): string {
	const tail = `${locale}/developers/${docRel}`;
	const basePrefix = siteBase === '/' ? '' : siteBase.replace(/\/$/, '');
	return (basePrefix ? `${basePrefix}/${tail}` : `/${tail}`) + '/';
}

function filePathToDocMeta(absPath: string): { docId: string; locale: AppLocale } | null {
	const fsPath = absPath.startsWith('file:') ? fileURLToPath(absPath) : absPath;
	const norm = fsPath.split(path.sep).join('/');
	const reUnderDevelopers = new RegExp(`/developers/(${localePathRe})/(.+)\\.md$`);
	const reCollectionRelative = new RegExp(`^(${localePathRe})/(.+)\\.md$`);
	const m = norm.match(reUnderDevelopers) ?? norm.match(reCollectionRelative);
	if (!m) return null;
	const locale = m[1] as AppLocale;
	return { locale, docId: `${locale}/${m[2]}` };
}

function hasScheme(url: string): boolean {
	return /^[a-zA-Z][a-zA-Z0-9+.-]*:/u.test(url);
}

function rewriteDocRelativeUrl(
	url: string,
	siteBase: string,
	locale: AppLocale,
	currentPath: string,
): string | null {
	if (!url || hasScheme(url) || url.startsWith('#')) return null;

	const hashIndex = url.indexOf('#');
	const pathPart = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
	const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';

	/* 仅处理显式相对路径：`./` 与 `../` 在路径解析中语义不同，由下方 join + normalize 体现 */
	if (!pathPart.startsWith('./') && !pathPart.startsWith('../')) return null;

	const dir = path.posix.dirname(currentPath);
	let joined = path.posix.normalize(path.posix.join(dir, pathPart));
	if (joined.startsWith('..') || joined.startsWith('/')) return null;
	if (joined.endsWith('.md')) joined = joined.slice(0, -3);

	return developerDocPageHref(siteBase, locale, joined) + hash;
}

/**
 * 在 `remark-rehype` 之前，把正文里以 `./`（相对当前文档目录）或 `../`（先退到上级目录再相对）写的站内相对链，
 * 解析成与侧栏一致的绝对 URL（含目录尾斜杠）。`path.posix.join` 会按上述语义分别处理，二者不可混为一谈。
 * 开发与生产 Markdown 管线一致；避免仅依赖 rehype 时受 `.astro` 缓存或预解顺序影响。
 */
export default function remarkDeveloperInternalLinks(siteBase: string) {
	return (tree: Root, file: VFile): void => {
		const rawPath = file.path;
		let pathStr = '';
		if (typeof rawPath === 'string') {
			pathStr = rawPath;
		} else if (rawPath != null && typeof rawPath === 'object') {
			try {
				pathStr = fileURLToPath(rawPath as URL);
			} catch {
				pathStr = String(rawPath);
			}
		}
		if (!pathStr) return;

		const meta = filePathToDocMeta(pathStr);
		if (!meta) return;
		const currentPath = developerDocPath({ id: meta.docId });

		const apply = (node: Link | Definition): void => {
			const next = rewriteDocRelativeUrl(node.url, siteBase, meta.locale, currentPath);
			if (next !== null) node.url = next;
		};

		visit(tree, 'link', (node: Link) => apply(node));
		visit(tree, 'definition', (node: Definition) => apply(node));
	};
}
