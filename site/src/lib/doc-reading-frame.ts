import { getCollection } from 'astro:content';
import type { AppLocale } from './appLocale';
import { developerDocPath } from './developerDocPath';
import { navUi } from './uiStrings';

export type DeveloperNavItem = { path: string; title: string };
export type DeveloperNavGroup = { label: string; items: DeveloperNavItem[] };

/** 与文档页侧栏一致：按内容集合与语言过滤后构建入门 / 插件 / 主题分组 */
export async function getDeveloperDocsNavGroups(locale: AppLocale): Promise<DeveloperNavGroup[]> {
	const all = await getCollection('docs');
	const prefix = `${locale}/`;
	const scoped = all.filter((d) => d.id.startsWith(prefix));
	const collator = locale === 'zh' ? 'zh-CN' : 'en';
	const byOrder = (a: { order: number; title: string }, b: { order: number; title: string }) =>
		a.order - b.order || a.title.localeCompare(b.title, collator);
	const ui = navUi(locale);
	const intro = scoped
		.filter((d) => stripAfterLocale(d.id).startsWith('intro/'))
		.map((d) => ({ path: developerDocPath(d), title: d.data.title, order: d.data.order }))
		.sort(byOrder);
	const pluginItems = scoped
		.filter((d) => stripAfterLocale(d.id).startsWith('plugin/'))
		.map((d) => ({ path: developerDocPath(d), title: d.data.title, order: d.data.order }))
		.sort(byOrder);
	const themeItems = scoped
		.filter((d) => stripAfterLocale(d.id).startsWith('theme/'))
		.map((d) => ({ path: developerDocPath(d), title: d.data.title, order: d.data.order }))
		.sort(byOrder);
	return [
		intro.length ? { label: ui.navIntro, items: intro.map(({ path, title }) => ({ path, title })) } : null,
		pluginItems.length ? { label: ui.navPlugin, items: pluginItems.map(({ path, title }) => ({ path, title })) } : null,
		themeItems.length ? { label: ui.navTheme, items: themeItems.map(({ path, title }) => ({ path, title })) } : null,
	].filter((g): g is DeveloperNavGroup => g != null);
}

function stripAfterLocale(id: string): string {
	if (id.startsWith('zh/') || id.startsWith('en/')) return id.slice(3);
	return id;
}
