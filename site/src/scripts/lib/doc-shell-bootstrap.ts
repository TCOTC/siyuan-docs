import {
	applyTocRailPinnedLayoutForHeadingId,
	getDecodedLocationHashFragment,
	syncDocOverlayLayoutMetrics,
	syncRailScrollEdges,
	tocSync,
} from './doc-reading-sync';

/** 阻塞首帧闪动：与 shell-ui 共用 toc/rail 算法（无 # 时整页刷新滚动由 Shell 首帧 sessionStorage 同步恢复；有 # 时由浏览器锚点定位） */
export function runDocShellBootstrap(): void {
	syncDocOverlayLayoutMetrics();
	const hashId = getDecodedLocationHashFragment();
	if (hashId) {
		applyTocRailPinnedLayoutForHeadingId(hashId);
	}
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
