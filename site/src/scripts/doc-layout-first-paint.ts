/**
 * 首屏布局变量与滚动恢复：由 `Shell.astro` 以 `<script is:inline set:html>` 注入（位于 `.read` 之后，以便 DOM 已含 `#main-content`）。
 * 写入 `--overlay-top` 与主栏 inset，与 `body.doc-layout` 上 CSS 预设的 `--sheet-pl` 衔接；大纲 `left` 由样式表纯 CSS 计算，无需首帧隐藏。
 * 有保存的滚动值时首帧同步 `scrollTo`（与 URL 是否含 `#` 无关）；无保存值时含 `#` 的页面仍由浏览器做锚点定位。
 * `docScrollSessionPrefix` 由 Astro `define:vars` 注入到脚本外层作用域。
 */
import { safeSessionGet } from './lib/safe-storage';

declare const docScrollSessionPrefix: string;

const root = document.documentElement;

const contentHead = document.querySelector('.bar');
if (contentHead instanceof HTMLElement) {
	const h = Math.ceil(contentHead.getBoundingClientRect().height);
	root.style.setProperty('--overlay-top', `${h}px`);
}

const docCenter = document.querySelector('.sheet');
if (docCenter instanceof HTMLElement) {
	const r = docCenter.getBoundingClientRect();
	const vw = document.documentElement.clientWidth;
	root.style.setProperty('--sheet-pl', `${r.left}px`);
	root.style.setProperty('--sheet-pr', `${Math.max(0, vw - r.right)}px`);
}

const rawY = safeSessionGet(docScrollSessionPrefix + location.pathname + location.search);
if (rawY != null) {
	const y = Number.parseInt(rawY, 10);
	if (!Number.isNaN(y) && y >= 0) {
		window.scrollTo(0, y);
	}
}
