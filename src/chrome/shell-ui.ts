/**
 * 文档页仍需命令式处理的壳层：工具条搬家、侧栏滚动条、TOC 同步、代码块复制、浮动提示。
 */
import { bindAnchoredFloatingHints } from './anchored-floating-hint';
import { startPagefindLoader } from './pagefind-loader';
import { scrollActiveRailNavIntoView, syncRailScrollEdges, tocSync } from './doc-reading-sync';
import { mountCodeBlockCopy } from './shell-ui/code-block-copy';
import { mountDocToolbarSlot } from './shell-ui/doc-toolbar-slot';
import { mountRailScrollWiring } from './shell-ui/rail-scroll-wiring';
import { mountTocInPage } from './shell-ui/toc-in-page';

let chromeAbort: AbortController | null = null;

/** 站内切页后：同步 TOC、为新正文注入代码复制、重绑浮动提示与搜索按钮 */
export function syncDocChromeAfterNavigation(): void {
	tocSync();
	mountCodeBlockCopy();
	bindAnchoredFloatingHints();
	startPagefindLoader();
}

export function unmountDocChrome(): void {
	chromeAbort?.abort();
	chromeAbort = null;
}

function runDocShellBootstrap(): void {
	syncRailScrollEdges();
	const tocListBoot = document.getElementById('doc-toc-list');
	const docMainBoot = document.getElementById('main-content');
	if (tocListBoot && docMainBoot?.classList.contains('read-main')) {
		tocSync();
	}
	requestAnimationFrame(() => {
		syncRailScrollEdges();
	});
}

export function mountDocChrome(): void {
	if (chromeAbort && !chromeAbort.signal.aborted) {
		syncDocChromeAfterNavigation();
		return;
	}
	unmountDocChrome();
	chromeAbort = new AbortController();
	const { signal } = chromeAbort;

	runDocShellBootstrap();
	scrollActiveRailNavIntoView();
	mountDocToolbarSlot(signal);
	mountRailScrollWiring(signal);
	mountTocInPage(signal);
	mountCodeBlockCopy();
	bindAnchoredFloatingHints();
}
