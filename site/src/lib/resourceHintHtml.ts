/** 写入 `set:html` 的 `<link rel="preload" … href="…">` 等片段时，对属性值做最小转义 */
export function escapeAttrForResourceHint(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export function linkPreloadScript(url: string): string {
	return `<link rel="preload" as="script" href="${escapeAttrForResourceHint(url)}" />`;
}

export function linkModulePreload(url: string): string {
	return `<link rel="modulepreload" href="${escapeAttrForResourceHint(url)}" />`;
}
