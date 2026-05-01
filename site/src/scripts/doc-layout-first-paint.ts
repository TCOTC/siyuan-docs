/**
 * 首屏布局变量与滚动恢复：由 `Shell.astro` 以 `<script is:inline set:html>` 注入。
 * `docScrollSessionPrefix`、`hasDocToc` 由 Astro `define:vars` 注入到脚本外层作用域。
 */
declare const docScrollSessionPrefix: string;
declare const hasDocToc: boolean;

const root = document.documentElement;
try {
	root.style.removeProperty('--doc-toc-fixed-left');
} catch {
	/* ignore */
}
const ch = document.querySelector('.content-head');
if (ch) {
	try {
		root.style.setProperty('--doc-overlay-top', Math.ceil(ch.getBoundingClientRect().height) + 'px');
	} catch {
		/* ignore */
	}
}
const dc = document.querySelector('.doc-center');
if (dc) {
	try {
		const r = dc.getBoundingClientRect();
		const vw = window.innerWidth || document.documentElement.clientWidth || 0;
		root.style.setProperty('--doc-content-head-inset-left', r.left + 'px');
		root.style.setProperty('--doc-content-head-inset-right', Math.max(0, vw - r.right) + 'px');
		if (hasDocToc && window.matchMedia && window.matchMedia('(min-width: 1000px)').matches) {
			const twRaw = getComputedStyle(root).getPropertyValue('--toc-aside-width').trim();
			const tw = parseFloat(twRaw);
			if (!isNaN(tw) && tw > 0) {
				root.style.setProperty('--doc-toc-fixed-left', Math.round(r.right - tw) + 'px');
			}
		}
	} catch {
		/* ignore */
	}
}
const h = window.location.hash;
if (!h || h.length < 2) {
	try {
		const rawY = sessionStorage.getItem(docScrollSessionPrefix + location.pathname + location.search);
		if (rawY != null) {
			const y = parseInt(rawY, 10);
			if (!isNaN(y) && y >= 0) window.scrollTo(0, y);
		}
	} catch {
		/* ignore */
	}
}
