/**
 * 文档页壳层：主题、工具条、复制与菜单、侧栏与 TOC、代码块复制。
 * 由 Vue 在挂载后调用，不再作为独立 IIFE 入口。
 */
import { bindAnchoredFloatingHints } from './anchored-floating-hint';
import { runDocShellBootstrap } from './doc-shell-bootstrap';
import { startPagefindLoader } from './pagefind-loader';
import { scrollActiveRailNavIntoView, tocSync } from './doc-reading-sync';
import { mountCodeBlockCopy } from './shell-ui/code-block-copy';
import { mountCopyPageMarkdown } from './shell-ui/copy-page-markdown';
import { mountDocLayoutChrome } from './shell-ui/doc-layout-chrome';
import { mountDocRailDrawer } from './shell-ui/doc-rail-drawer';
import { mountDocToolbarSlot } from './shell-ui/doc-toolbar-slot';
import { mountHeaderMenus } from './shell-ui/header-menus';
import { mountRailScrollWiring } from './shell-ui/rail-scroll-wiring';
import { mountShellThemeAndLocale } from './shell-ui/theme-and-locale';
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

export function mountDocChrome(): void {
	if (chromeAbort && !chromeAbort.signal.aborted) {
		syncDocChromeAfterNavigation();
		return;
	}
	unmountDocChrome();
	chromeAbort = new AbortController();
	const { signal } = chromeAbort;

	if (document.body.classList.contains('doc-layout')) {
		runDocShellBootstrap();
		scrollActiveRailNavIntoView();
	}

	mountShellThemeAndLocale(signal);
	mountDocToolbarSlot(signal);
	const copyPage = mountCopyPageMarkdown(signal);
	mountHeaderMenus(copyPage, signal);
	mountDocRailDrawer(signal);
	mountRailScrollWiring(signal);

	if (document.body.classList.contains('doc-layout')) {
		mountDocLayoutChrome(signal);
	}

	mountTocInPage(signal);
	mountCodeBlockCopy();
	bindAnchoredFloatingHints();
}
