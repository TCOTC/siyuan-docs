/**
 * 首屏布局变量与滚动恢复：由 `Shell.astro` 以 `<script is:inline set:html>` 注入（位于 `.read` 之后，以便 DOM 已含 `#main-content`）。
 * 主栏 inset 经 `applyDocSheetViewportInsets` 写回 `body`（仅当与计算值差 ≥ 1px，避免与 `clamp` 首帧重复触发布局）；`--overlay-top` 由 `body.doc-layout` 与 `.bar` 边框盒对齐，不再首帧改写。
 * 大纲 `left` 由样式表纯 CSS 计算，无需首帧隐藏。
 * 有保存的滚动值时在下一帧 `requestAnimationFrame` 内 `scrollTo`（与 URL 是否含 `#` 无关），减轻与首帧布局的竞争；无保存值时含 `#` 的页面仍由浏览器做锚点定位。
 * `docScrollSessionPrefix` 由 Astro `define:vars` 注入到脚本外层作用域。
 */
import { applyDocSheetViewportInsets } from './lib/doc-sheet-insets';
import { safeSessionGet } from './lib/safe-storage';

declare const docScrollSessionPrefix: string;

applyDocSheetViewportInsets();

const rawY = safeSessionGet(docScrollSessionPrefix + location.pathname + location.search);
if (rawY != null) {
	const y = Number.parseInt(rawY, 10);
	if (!Number.isNaN(y) && y >= 0) {
		requestAnimationFrame(() => {
			if (Math.abs(window.scrollY - y) > 1) {
				window.scrollTo(0, y);
			}
		});
	}
}
