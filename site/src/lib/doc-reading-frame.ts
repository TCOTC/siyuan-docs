import { getCollection } from 'astro:content';
import { appI18nLocales, localeCollatorBcp47, type AppLocale } from './appLocale';
import { developerDocPath } from './developerDocPath';
import { shellUi } from './uiStrings';

export type DeveloperNavItem = { path: string; title: string };
export type DeveloperNavGroup = { label: string; items: DeveloperNavItem[] };

/** 与 `developers/<locale>/intro|plugin|theme/` 目录一一对应，用于「分组路径」重定向 */
export type DeveloperNavFolderKey = 'intro' | 'plugin' | 'theme';

/** 与文档页侧栏一致：按内容集合与语言过滤后构建入门 / 插件 / 主题分组 */
export async function getDeveloperDocsNavGroups(locale: AppLocale): Promise<DeveloperNavGroup[]> {
	const ui = shellUi(locale);
	const intro = await developerNavDocsSortedForIdPrefix(locale, 'intro/');
	const pluginItems = await developerNavDocsSortedForIdPrefix(locale, 'plugin/');
	const themeItems = await developerNavDocsSortedForIdPrefix(locale, 'theme/');
	return [
		intro.length ? { label: ui.navIntro, items: intro.map(({ path, title }) => ({ path, title })) } : null,
		pluginItems.length ? { label: ui.navPlugin, items: pluginItems.map(({ path, title }) => ({ path, title })) } : null,
		themeItems.length ? { label: ui.navTheme, items: themeItems.map(({ path, title }) => ({ path, title })) } : null,
	].filter((g): g is DeveloperNavGroup => g != null);
}

/**
 * `root`：侧栏顺序下第一篇（通常为入门组首篇）；`intro` / `plugin` / `theme`：该目录内排序后的第一篇。
 * 用于 `/…/developers/`、`/…/developers/plugin/` 等无具体文档 slug 时的跳转目标。
 */
export async function firstDeveloperDocRelPathForFolder(
	locale: AppLocale,
	folder: 'root' | DeveloperNavFolderKey,
): Promise<string | null> {
	if (folder !== 'root') {
		const items = await developerNavDocsSortedForIdPrefix(locale, `${folder}/`);
		return items[0]?.path ?? null;
	}
	for (const key of ['intro', 'plugin', 'theme'] as const) {
		const items = await developerNavDocsSortedForIdPrefix(locale, `${key}/`);
		if (items[0]) return items[0].path;
	}
	return null;
}

async function developerNavDocsSortedForIdPrefix(
	locale: AppLocale,
	idPrefix: string,
): Promise<DeveloperNavItem[]> {
	const all = await getCollection('docs');
	const prefix = `${locale}/`;
	const scoped = all.filter((d) => d.id.startsWith(prefix));
	const collator = localeCollatorBcp47[locale];
	const byOrder = (a: { order: number; title: string }, b: { order: number; title: string }) =>
		a.order - b.order || a.title.localeCompare(b.title, collator);
	return scoped
		.filter((d) => stripAfterLocale(d.id).startsWith(idPrefix))
		.map((d) => ({ path: developerDocPath(d), title: d.data.title, order: d.data.order }))
		.sort(byOrder)
		.map(({ path, title }) => ({ path, title }));
}

function stripAfterLocale(id: string): string {
	for (const loc of appI18nLocales) {
		const p = `${loc}/`;
		if (id.startsWith(p)) return id.slice(p.length);
	}
	return id;
}
