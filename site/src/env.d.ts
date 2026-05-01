/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
	/** 脚本自动滚动侧栏目录时的嵌套深度；> 0 时不短暂显示滚动条 */
	__siyuanRailScrollProg?: number;
}
