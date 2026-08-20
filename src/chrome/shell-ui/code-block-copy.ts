import { zhCNCodeBlockCopyUi } from '../../i18n/zh-CN';
import { enCodeBlockCopyUi } from '../../i18n/en';
import type { CodeBlockCopyUi } from '../../i18n/types';
import { defaultLocale, type AppLocale } from '../../lib/locales';
import { normalizeLocale } from '../../lib/localePreference';

const CODE_COPY_I18N: Record<AppLocale, CodeBlockCopyUi> = {
	'zh-CN': zhCNCodeBlockCopyUi,
	en: enCodeBlockCopyUi,
};

/** 与 Shell、`not-found-locale-head-sync` 一致：优先 `data-doc-locale`，否则取 `<html lang>` 的主语言段；非站内语言则回退 `defaultLocale` */
function localeForCodeBlockCopy(): AppLocale {
	const dataLoc = document.documentElement.getAttribute('data-doc-locale');
	if (dataLoc) {
		const loc = normalizeLocale(dataLoc);
		if (loc) return loc;
	}
	const lang = (document.documentElement.getAttribute('lang') || '').trim();
	return normalizeLocale(lang) ?? defaultLocale;
}

/** 为 `.prose pre` 注入代码块复制按钮 */
export function mountCodeBlockCopy(): void {
	const { copyAria, copiedAria, failedAria } = CODE_COPY_I18N[localeForCodeBlockCopy()];
	const copySvg =
		'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
	const checkSvg =
		'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
	const xSvg =
		'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
	function getCodePlainText(pre: HTMLElement): string {
		const c = pre.querySelector('code');
		if (c) return c.innerText;
		const clone = pre.cloneNode(true) as HTMLElement;
		clone.querySelector('.code-block-copy')?.remove();
		return (clone.textContent ?? '').replace(/\s+$/, '');
	}
	function wireCopyButton(btn: HTMLButtonElement, pre: HTMLElement): void {
		const idleEl = btn.querySelector('.code-block-copy__state--idle');
		const doneEl = btn.querySelector('.code-block-copy__state--done');
		const errEl = btn.querySelector('.code-block-copy__state--error');
		let feedbackTimer: number | undefined;
		function resetIdle(): void {
			btn.classList.remove('code-block-copy--success', 'code-block-copy--error');
			btn.setAttribute('aria-label', copyAria);
			idleEl?.removeAttribute('hidden');
			doneEl?.setAttribute('hidden', '');
			errEl?.setAttribute('hidden', '');
		}
		function flashSuccess(): void {
			window.clearTimeout(feedbackTimer);
			btn.classList.remove('code-block-copy--error');
			errEl?.setAttribute('hidden', '');
			btn.classList.add('code-block-copy--success');
			btn.setAttribute('aria-label', copiedAria);
			idleEl?.setAttribute('hidden', '');
			doneEl?.removeAttribute('hidden');
			feedbackTimer = window.setTimeout(resetIdle, 1600);
		}
		function flashError(): void {
			window.clearTimeout(feedbackTimer);
			btn.classList.remove('code-block-copy--success');
			doneEl?.setAttribute('hidden', '');
			btn.classList.add('code-block-copy--error');
			btn.setAttribute('aria-label', failedAria);
			idleEl?.setAttribute('hidden', '');
			errEl?.removeAttribute('hidden');
			feedbackTimer = window.setTimeout(resetIdle, 1600);
		}
		btn.addEventListener('click', () => {
			const text = getCodePlainText(pre);
			if (!text) {
				flashError();
				return;
			}
			void navigator.clipboard.writeText(text).then(flashSuccess).catch(flashError);
		});
	}
	for (const pre of document.querySelectorAll<HTMLElement>('.prose pre')) {
		if (pre.querySelector('.code-block-copy')) continue;
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'icon-btn code-block-copy';
		btn.setAttribute('aria-label', copyAria);
		btn.innerHTML =
			`<span class="code-block-copy__state code-block-copy__state--idle">${copySvg}</span>` +
			`<span class="code-block-copy__state code-block-copy__state--done" hidden>${checkSvg}</span>` +
			`<span class="code-block-copy__state code-block-copy__state--error" hidden>${xSvg}</span>`;
		wireCopyButton(btn, pre);
		pre.appendChild(btn);
	}
}
