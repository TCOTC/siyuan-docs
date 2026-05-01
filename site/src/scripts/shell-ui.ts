/**
 * 文档页 Shell 延后脚本：主题 / 工具条 / 复制与菜单 / 侧栏与 TOC / 代码块复制。
 * 具体逻辑按域拆至 `lib/shell-ui/*`，本文件仅保证与 `shell-after-load` 聚合时的执行顺序。
 */
import { runDocShellBootstrap } from './lib/doc-shell-bootstrap';
import { mountCodeBlockCopy } from './lib/shell-ui/code-block-copy';
import { mountCopyPageMarkdown } from './lib/shell-ui/copy-page-markdown';
import { mountDocLayoutChrome } from './lib/shell-ui/doc-layout-chrome';
import { mountDocRailDrawer } from './lib/shell-ui/doc-rail-drawer';
import { mountDocToolbarSlot } from './lib/shell-ui/doc-toolbar-slot';
import { mountHeaderMenus } from './lib/shell-ui/header-menus';
import { mountRailScrollWiring } from './lib/shell-ui/rail-scroll-wiring';
import { mountShellThemeAndLocale } from './lib/shell-ui/theme-and-locale';
import { mountTocInPage } from './lib/shell-ui/toc-in-page';

(function initShellUi(): void {
	if (document.body.classList.contains('doc-layout')) {
		runDocShellBootstrap();
	}

	mountShellThemeAndLocale();
	mountDocToolbarSlot();
	const copyPage = mountCopyPageMarkdown();
	mountHeaderMenus(copyPage);
	mountDocRailDrawer();
	mountRailScrollWiring();

	if (document.body.classList.contains('doc-layout')) {
		mountDocLayoutChrome();
	}

	mountTocInPage();
	mountCodeBlockCopy();
})();
