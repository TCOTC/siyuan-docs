import { syncDocOverlayLayoutMetrics, syncRailScrollEdges, tocSync } from './doc-reading-sync';

/** 阻塞首帧闪动：与 shell-ui 共用 toc/rail 算法；正文滚动由 Shell 首帧 sessionStorage 或浏览器默认（无保存值且含 `#`）决定，大纲仅跟视口阅读线。 */
export function runDocShellBootstrap(): void {
	syncDocOverlayLayoutMetrics();
	syncRailScrollEdges();
	const tocListBoot = document.getElementById('doc-toc-list');
	const docMainBoot = document.getElementById('main-content');
	if (tocListBoot && docMainBoot?.classList.contains('doc-main')) {
		tocSync();
		window.__siyuanDocsTocBootstrapped = true;
	}
	requestAnimationFrame(() => {
		syncRailScrollEdges();
	});
}
