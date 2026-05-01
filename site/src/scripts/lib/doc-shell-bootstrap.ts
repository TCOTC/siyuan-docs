import { syncRailScrollEdges, tocSync } from './doc-reading-sync';

/** 阻塞首帧闪动：与 shell-ui 共用 toc/rail 算法 */
export function runDocShellBootstrap(): void {
	syncRailScrollEdges();
	const tocListBoot = document.getElementById('doc-toc-list');
	const docMainBoot = document.getElementById('main-content');
	if (
		tocListBoot &&
		docMainBoot &&
		docMainBoot.classList.contains('doc-main')
	) {
		tocSync();
		window.__siyuanDocsTocBootstrapped = true;
	}
	document.documentElement.classList.add('doc-shell-ready');
	if (typeof window.requestAnimationFrame === 'function') {
		window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				syncRailScrollEdges();
				document.documentElement.classList.add('toc-indicator-motion');
			});
		});
	} else {
		syncRailScrollEdges();
		document.documentElement.classList.add('toc-indicator-motion');
	}
}
