/**
 * 首屏滚动恢复：由 `Shell.astro` 以 `<script is:inline set:html>` 注入（位于 `.read` 之后，以便 DOM 已含 `#main-content`）。
 * 主栏水平 inset 与侧栏宽度由 `body.doc-layout` 的 `--doc-rail-width` / `--rail-grid` / `--sheet-pl` 纯 CSS 统一，无需首帧写变量。
 * `--overlay-top` 由 `body.doc-layout` 与 `.bar` 边框盒对齐；大纲 `left` 由 `_document.scss` 纯 CSS 推算。
 * 有保存的滚动值时在下一帧 `requestAnimationFrame` 内 `scrollTo`（与 URL 是否含 `#` 无关），减轻与首帧布局的竞争；无保存值时含 `#` 的页面仍由浏览器做锚点定位。
 * `docScrollSessionPrefix` 由 Astro `define:vars` 注入到脚本外层作用域。
 */
import { safeSessionGet } from './lib/safe-storage';

declare const docScrollSessionPrefix: string;

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
