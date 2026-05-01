/**
 * 首屏布局变量与滚动恢复：由 `Shell.astro` 以 `<script is:inline set:html>` 注入。
 * 有保存的滚动值时首帧同步 `scrollTo`（与 URL 是否含 `#` 无关）；无保存值时含 `#` 的页面仍由浏览器做锚点定位。
 * `docScrollSessionPrefix`、`hasDocToc` 由 Astro `define:vars` 注入到脚本外层作用域。
 */
import { safeSessionGet } from './lib/safe-storage';

declare const docScrollSessionPrefix: string;
declare const hasDocToc: boolean;

const root = document.documentElement;
root.style.removeProperty('--doc-toc-fixed-left');

const contentHead = document.querySelector('.content-head');
if (contentHead instanceof HTMLElement) {
	const h = Math.ceil(contentHead.getBoundingClientRect().height);
	root.style.setProperty('--doc-overlay-top', `${h}px`);
}

const docCenter = document.querySelector('.doc-center');
if (docCenter instanceof HTMLElement) {
	const r = docCenter.getBoundingClientRect();
	const vw = document.documentElement.clientWidth;
	root.style.setProperty('--doc-content-head-inset-left', `${r.left}px`);
	root.style.setProperty('--doc-content-head-inset-right', `${Math.max(0, vw - r.right)}px`);

	if (hasDocToc && window.matchMedia('(min-width: 1000px)').matches) {
		const twRaw = getComputedStyle(root).getPropertyValue('--toc-aside-width').trim();
		const tw = Number.parseFloat(twRaw);
		if (!Number.isNaN(tw) && tw > 0) {
			root.style.setProperty('--doc-toc-fixed-left', `${Math.round(r.right - tw)}px`);
		}
	}
}

const rawY = safeSessionGet(docScrollSessionPrefix + location.pathname + location.search);
if (rawY != null) {
	const y = Number.parseInt(rawY, 10);
	if (!Number.isNaN(y) && y >= 0) {
		window.scrollTo(0, y);
	}
}
