import type { CopyPageMarkdownControls } from './copy-page-markdown';

/** 复制菜单与语言切换面板的开关、互斥与 Escape 关闭 */
export function mountHeaderMenus(copy: CopyPageMarkdownControls): void {
	const menuBtn = document.getElementById('copy-page-menu-btn');
	const panel = document.getElementById('copy-page-menu');
	const copyPageMenuMd = document.getElementById('copy-page-menu-md');
	const viewPageMd = document.getElementById('copy-page-view-md');
	const langMenuBtn = document.getElementById('lang-switch-btn');
	const langMenuPanel = document.getElementById('lang-switch-panel');

	function closeCopyMenu(): void {
		if (!panel || !menuBtn) return;
		panel.hidden = true;
		panel.classList.remove('is-open');
		menuBtn.setAttribute('aria-expanded', 'false');
	}

	function openCopyMenu(): void {
		if (!panel || !menuBtn) return;
		panel.hidden = false;
		panel.classList.add('is-open');
		menuBtn.setAttribute('aria-expanded', 'true');
	}

	function closeLangMenu(): void {
		if (!langMenuPanel || !langMenuBtn) return;
		langMenuPanel.hidden = true;
		langMenuPanel.classList.remove('is-open');
		langMenuBtn.setAttribute('aria-expanded', 'false');
	}

	function openLangMenu(): void {
		if (!langMenuPanel || !langMenuBtn) return;
		langMenuPanel.hidden = false;
		langMenuPanel.classList.add('is-open');
		langMenuBtn.setAttribute('aria-expanded', 'true');
	}

	if (menuBtn && panel) {
		menuBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			closeLangMenu();
			if (panel.classList.contains('is-open')) closeCopyMenu();
			else openCopyMenu();
		});
		panel.addEventListener('click', (e) => {
			e.stopPropagation();
		});
	}
	if (langMenuBtn && langMenuPanel) {
		langMenuBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			closeCopyMenu();
			if (langMenuPanel.classList.contains('is-open')) closeLangMenu();
			else openLangMenu();
		});
		langMenuPanel.addEventListener('click', (e) => {
			e.stopPropagation();
		});
	}
	document.addEventListener('click', () => {
		closeCopyMenu();
		closeLangMenu();
	});
	document.addEventListener('keydown', (e: KeyboardEvent) => {
		if (e.key !== 'Escape' || e.defaultPrevented) return;
		closeCopyMenu();
		closeLangMenu();
	});
	copyPageMenuMd?.addEventListener('click', () => {
		copy.triggerWithFeedback();
		closeCopyMenu();
	});
	viewPageMd?.addEventListener('click', () => {
		closeCopyMenu();
	});
}
