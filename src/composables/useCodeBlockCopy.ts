import { onUnmounted, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue';
import { zhCNCodeBlockCopyUi } from '../i18n/zh-CN';
import { enCodeBlockCopyUi } from '../i18n/en';
import type { CodeBlockCopyUi } from '../i18n/types';
import { defaultLocale, type AppLocale } from '../lib/locales';

const CODE_COPY_I18N: Record<AppLocale, CodeBlockCopyUi> = {
	'zh-CN': zhCNCodeBlockCopyUi,
	en: enCodeBlockCopyUi,
};

function unmountCodeBlockCopy(root: HTMLElement): void {
	for (const btn of root.querySelectorAll('.code-block-copy')) {
		btn.remove();
	}
}

/** 为文章内 `pre` 注入复制按钮；正文来自 v-html，按钮只能命令式挂载 */
function mountCodeBlockCopy(root: HTMLElement, locale: AppLocale): void {
	unmountCodeBlockCopy(root);
	const { copyAria, copiedAria, failedAria } = CODE_COPY_I18N[locale] ?? CODE_COPY_I18N[defaultLocale];
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
	for (const pre of root.querySelectorAll<HTMLElement>('pre')) {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'code-block-copy';
		btn.setAttribute('aria-label', copyAria);
		btn.innerHTML =
			`<span class="code-block-copy__state code-block-copy__state--idle">${copySvg}</span>` +
			`<span class="code-block-copy__state code-block-copy__state--done" hidden>${checkSvg}</span>` +
			`<span class="code-block-copy__state code-block-copy__state--error" hidden>${xSvg}</span>`;
		wireCopyButton(btn, pre);
		pre.appendChild(btn);
	}
}

export function useCodeBlockCopy(
	root: Ref<HTMLElement | null>,
	locale: MaybeRefOrGetter<AppLocale>,
	contentKey: MaybeRefOrGetter<string>,
): void {
	watch(
		[root, () => toValue(locale), () => toValue(contentKey)],
		() => {
			if (import.meta.env.SSR) return;
			const el = root.value;
			if (!el) return;
			mountCodeBlockCopy(el, toValue(locale));
		},
		{ flush: 'post', immediate: true },
	);
	onUnmounted(() => {
		const el = root.value;
		if (el) unmountCodeBlockCopy(el);
	});
}
