import { getCollection } from 'astro:content';
import { developerDocPath } from './developerDocPath';

export type DeveloperNavItem = { path: string; title: string };
export type DeveloperNavGroup = { label: string; items: DeveloperNavItem[] };

/** 与文档页侧栏一致：按内容集合构建入门 / 插件 / 主题分组 */
export async function getDeveloperDocsNavGroups(): Promise<DeveloperNavGroup[]> {
	const all = await getCollection('docs');
	const byOrder = (a: { order: number; title: string }, b: { order: number; title: string }) =>
		a.order - b.order || a.title.localeCompare(b.title, 'zh-CN');
	const intro = all
		.filter((d) => d.id.startsWith('intro/'))
		.map((d) => ({ path: developerDocPath(d), title: d.data.title, order: d.data.order }))
		.sort(byOrder);
	const pluginItems = all
		.filter((d) => d.id.startsWith('plugin/'))
		.map((d) => ({ path: developerDocPath(d), title: d.data.title, order: d.data.order }))
		.sort(byOrder);
	const themeItems = all
		.filter((d) => d.id.startsWith('theme/'))
		.map((d) => ({ path: developerDocPath(d), title: d.data.title, order: d.data.order }))
		.sort(byOrder);
	return [
		intro.length ? { label: '入门', items: intro.map(({ path, title }) => ({ path, title })) } : null,
		pluginItems.length ? { label: '插件', items: pluginItems.map(({ path, title }) => ({ path, title })) } : null,
		themeItems.length ? { label: '主题', items: themeItems.map(({ path, title }) => ({ path, title })) } : null,
	].filter((g): g is DeveloperNavGroup => g != null);
}
