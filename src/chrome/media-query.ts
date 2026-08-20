/** 仅面向现代浏览器：统一用 MediaQueryList#addEventListener('change') */

export function onMediaQueryChange(
	mql: MediaQueryList,
	handler: (event: MediaQueryListEvent) => void,
	signal?: AbortSignal,
): void {
	mql.addEventListener('change', handler, signal ? { signal } : undefined);
}
