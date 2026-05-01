/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*?inline-bundle' {
	const inlineBundle: string;
	export default inlineBundle;
}

interface Window {
	/** 脚本自动滚动侧栏目录时的嵌套深度；> 0 时不短暂显示滚动条 */
	__siyuanRailScrollProg?: number;
}
