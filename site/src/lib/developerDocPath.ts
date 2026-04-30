/** 侧栏与面包屑用的分组标签（由文件所在子目录决定） */
export type DeveloperNavLabel = '入门' | '插件' | '主题';

const INTRO_PREFIX = 'intro/';

/** 文档在站点内的路径（位于 `developers/` 之后，不含前后斜杠） */
export function developerDocPath(doc: { id: string }): string {
	if (doc.id.startsWith(INTRO_PREFIX)) return doc.id.slice(INTRO_PREFIX.length);
	return doc.id;
}

export function developerNavGroupLabel(id: string): DeveloperNavLabel {
	if (id.startsWith('plugin/')) return '插件';
	if (id.startsWith('theme/')) return '主题';
	return '入门';
}
