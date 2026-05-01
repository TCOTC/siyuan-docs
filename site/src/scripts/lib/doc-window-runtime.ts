/**
 * 跨独立 IIFE（如 `doc-rail-scroll-boot`）与主包（`doc-reading-sync`）的极少数运行时状态。
 * 二者无共享 ES 模块单例，故以单一 `window.__siyuanDocs` 挂载点集中读写，避免散落多个 `window` 字段。
 */

const RUNTIME_KEY = '__siyuanDocs' as const;

export type SiyuanDocsWindowRuntime = {
	/** 脚本自动滚动侧栏目录时的嵌套深度；> 0 时不短暂显示滚动条 */
	programmaticRailScrollDepth: number;
	/** 侧栏首屏程序化滚动阶段（doc-rail-scroll-boot）：抑制滚动条短暂点亮；不写 `<html>` class，避免首帧类名闪烁 */
	railScrollBootSuppress?: boolean;
};

function getRuntime(): SiyuanDocsWindowRuntime {
	const w = window as Window & { __siyuanDocs?: SiyuanDocsWindowRuntime };
	let r = w[RUNTIME_KEY];
	if (!r) {
		r = { programmaticRailScrollDepth: 0 };
		w[RUNTIME_KEY] = r;
	}
	return r;
}

export function bumpProgrammaticRailScrollDepth(): void {
	getRuntime().programmaticRailScrollDepth += 1;
}

export function releaseProgrammaticRailScrollDepth(): void {
	const r = getRuntime();
	r.programmaticRailScrollDepth = Math.max(0, r.programmaticRailScrollDepth - 1);
}

export function scheduleReleaseProgrammaticRailScrollDepth(): void {
	queueMicrotask(() => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				releaseProgrammaticRailScrollDepth();
			});
		});
	});
}

/** 自动定位侧栏滚动时为 true；供 `shell-ui` 抑制滚动条短暂显隐 */
export function isProgrammaticRailScroll(): boolean {
	return getRuntime().programmaticRailScrollDepth > 0;
}

export function setRailScrollBootSuppress(v: boolean): void {
	getRuntime().railScrollBootSuppress = v;
}

export function isRailScrollBootSuppress(): boolean {
	return getRuntime().railScrollBootSuppress === true;
}
