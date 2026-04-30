const LOCALE_PREFIXES = ['zh/', 'en/'] as const;

/** 去掉集合 id 前的 `zh/`、`en/` 等语言前缀 */
export function stripLocalePrefixFromDocId(id: string): string {
	for (const p of LOCALE_PREFIXES) {
		if (id.startsWith(p)) return id.slice(p.length);
	}
	return id;
}

const INTRO_PREFIX = 'intro/';

/** 文档在 `developers/` 之后的路径段（不含前后斜杠），如 `welcome`、`plugin/plugin-overview` */
export function developerDocPath(doc: { id: string }): string {
	const id = stripLocalePrefixFromDocId(doc.id);
	if (id.startsWith(INTRO_PREFIX)) return id.slice(INTRO_PREFIX.length);
	return id;
}

export type NavGroupKey = 'intro' | 'plugin' | 'theme';

export function developerNavGroupKey(id: string): NavGroupKey {
	const stripped = stripLocalePrefixFromDocId(id);
	if (stripped.startsWith('plugin/')) return 'plugin';
	if (stripped.startsWith('theme/')) return 'theme';
	return 'intro';
}
