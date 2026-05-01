/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*?inline-bundle' {
	const inlineBundle: string;
	export default inlineBundle;
}

interface Window {
	/**
	 * 独立 IIFE 与主包共用的极少数状态；勿直接读写，请用 `src/scripts/lib/doc-window-runtime.ts`。
	 */
	__siyuanDocs?: {
		programmaticRailScrollDepth: number;
	};
}
