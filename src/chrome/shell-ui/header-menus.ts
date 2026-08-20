import type { CopyPageMarkdownControls } from './copy-page-markdown';

function copyMenuEls(): { btn: HTMLElement; panel: HTMLElement } | null {
	const btn = document.getElementById('copy-page-menu-btn');
	const panel = document.getElementById('copy-page-menu');
	if (!(btn instanceof HTMLElement) || !(panel instanceof HTMLElement)) return null;
	return { btn, panel };
}

function langMenuEls(): { btn: HTMLElement; panel: HTMLElement } | null {
	const btn = document.getElementById('lang-switch-btn');
	const panel = document.getElementById('lang-switch-panel');
	if (!(btn instanceof HTMLElement) || !(panel instanceof HTMLElement)) return null;
	return { btn, panel };
}

function closeCopyMenu(): void {
	const els = copyMenuEls();
	if (!els) return;
	els.panel.hidden = true;
	els.panel.classList.remove('is-open');
	els.btn.setAttribute('aria-expanded', 'false');
}

function openCopyMenu(): void {
	const els = copyMenuEls();
	if (!els) return;
	els.panel.hidden = false;
	els.panel.classList.add('is-open');
	els.btn.setAttribute('aria-expanded', 'true');
}

function closeLangMenu(): void {
	const els = langMenuEls();
	if (!els) return;
	els.panel.hidden = true;
	els.panel.classList.remove('is-open');
	els.btn.setAttribute('aria-expanded', 'false');
}

function openLangMenu(): void {
	const els = langMenuEls();
	if (!els) return;
	els.panel.hidden = false;
	els.panel.classList.add('is-open');
	els.btn.setAttribute('aria-expanded', 'true');
}

/** 复制菜单与语言切换面板的开关、互斥与 Escape 关闭（点击委托，适应站内切页） */
export function mountHeaderMenus(copy: CopyPageMarkdownControls, signal: AbortSignal): void {
	document.addEventListener(
		'click',
		(e: MouseEvent) => {
			const t = e.target;
			if (!(t instanceof Element)) return;
			if (t.closest('#copy-page-menu-md')) {
				copy.triggerWithFeedback();
				closeCopyMenu();
				return;
			}
			if (t.closest('#copy-page-view-md')) {
				closeCopyMenu();
				return;
			}
			if (t.closest('#copy-page-menu-btn')) {
				closeLangMenu();
				const panel = copyMenuEls()?.panel;
				if (panel?.classList.contains('is-open')) closeCopyMenu();
				else openCopyMenu();
				return;
			}
			if (t.closest('#lang-switch-btn')) {
				closeCopyMenu();
				const panel = langMenuEls()?.panel;
				if (panel?.classList.contains('is-open')) closeLangMenu();
				else openLangMenu();
				return;
			}
			if (t.closest('#copy-page-menu') || t.closest('#lang-switch-panel')) return;
			closeCopyMenu();
			closeLangMenu();
		},
		{ signal },
	);
	document.addEventListener(
		'keydown',
		(e: KeyboardEvent) => {
			if (e.key !== 'Escape' || e.defaultPrevented) return;
			closeCopyMenu();
			closeLangMenu();
		},
		{ signal },
	);
}
