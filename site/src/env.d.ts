/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*?inline-bundle' {
	const inlineBundle: string;
	export default inlineBundle;
}

interface Window {
	/** 脚本自动滚动侧栏目录时的嵌套深度；> 0 时不短暂显示滚动条 */
	__siyuanRailScrollProg?: number;
	/** `doc-shell-bootstrap` 与 `shell-ui` 之间的一次性握手，避免重复首帧 TOC 同步 */
	__siyuanDocsTocBootstrapped?: boolean;
}
