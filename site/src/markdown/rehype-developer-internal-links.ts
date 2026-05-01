import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';
import type { AppLocale } from '../lib/appLocale';
import { developerDocPath } from '../lib/developerDocPath';

/**
 * 与 `developerPageRelativePath` + `prefixDefaultLocale` 对齐的站内文档 URL（含 `base`），
 * 不在此文件中引用 `astro:i18n`，以免 `astro.config` 加载链解析失败。
 */
function developerDocPageHref(siteBase: string, locale: AppLocale, docRelPath: string): string {
	const clean = docRelPath.replace(/^\/+/, '').replace(/\/+$/, '');
	const tail = `${locale}/developers/${clean}`.replace(/\/{2,}/g, '/');
	if (!siteBase || siteBase === '/') return `/${tail}`;
	const prefix = siteBase.endsWith('/') ? siteBase.slice(0, -1) : siteBase;
	return `${prefix}/${tail}`;
}

/**
 * 仅处理正文里以 `./`、`../` 开头的站内相对链接，写成根相对绝对路径，
 * 避免托管为目录 URL 自动加尾斜杠后，浏览器仍按「当前目录」解析相对链接而跳错。
 */
export default function rehypeDeveloperInternalLinks(
	siteBase: string,
): (tree: Root, file?: { path?: string }) => void {
	return (tree: Root, file?: { path?: string }): void => {
		if (!file?.path) return;
		const id = filePathToDocId(file.path);
		if (!id) return;

		const locale = id.split('/')[0] as AppLocale;
		const currentPath = developerDocPath({ id });

		visit(tree, 'element', (node: Element) => {
			if (node.tagName !== 'a') return;
			const raw = node.properties?.href;
			if (typeof raw !== 'string' || raw.length === 0) return;
			if (!raw.startsWith('./') && !raw.startsWith('../')) return;

			const hashIndex = raw.indexOf('#');
			const pathPart = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;
			const hash = hashIndex >= 0 ? raw.slice(hashIndex) : '';

			const dir = path.posix.dirname(currentPath);
			let joined = path.posix.normalize(path.posix.join(dir, pathPart));
			if (joined.startsWith('..') || joined.startsWith('/')) return;

			if (joined.endsWith('.md')) joined = joined.slice(0, -3);

			node.properties.href = developerDocPageHref(siteBase, locale, joined) + hash;
		});
	};
}

/** 从磁盘路径或 `file://` URL 还原 content id，如 `zh/plugin/plugin-api-basics` */
function filePathToDocId(absPath: string): string | null {
	const fsPath = absPath.startsWith('file:') ? fileURLToPath(absPath) : absPath;
	const norm = fsPath.split(path.sep).join('/');
	const m = norm.match(/\/developers\/(zh|en)\/(.+)\.md$/);
	if (!m) return null;
	return `${m[1]}/${m[2]}`;
}
