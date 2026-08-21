import { toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue';
import { shellUi } from '../i18n';
import type { AppLocale } from '../lib/locales';

const copySvg =
	'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const checkSvg =
	'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

function unmountCodeBlockCopy(root: HTMLElement): void {
	for (const btn of root.querySelectorAll('.code-block-copy')) {
		btn.remove();
	}
}

function getCodePlainText(pre: HTMLElement): string {
	// chroma 每行已含 `\n`，`.highlight-line` 又是 block；`innerText` 会再插一行，复制出现空行
	const raw = pre.querySelector('code')?.textContent ?? '';
	return raw.replace(/\s+$/, '');
}

/** 为文章内 `pre` 注入复制按钮；正文来自 v-html，按钮只能命令式挂载，点击走根节点委托 */
function mountCodeBlockCopy(root: HTMLElement, copyAria: string): void {
	unmountCodeBlockCopy(root);
	for (const pre of root.querySelectorAll<HTMLElement>('pre')) {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'code-block-copy';
		btn.setAttribute('aria-label', copyAria);
		btn.innerHTML =
			`<span class="code-block-copy__state code-block-copy__state--idle">${copySvg}</span>` +
			`<span class="code-block-copy__state code-block-copy__state--done" hidden>${checkSvg}</span>`;
		pre.appendChild(btn);
	}
}

export function useCodeBlockCopy(
	root: Ref<HTMLElement | null>,
	locale: MaybeRefOrGetter<AppLocale>,
	contentKey: MaybeRefOrGetter<string>,
): void {
	let feedbackTimer: number | undefined;

	function onClick(e: Event): void {
		const t = e.target;
		if (!(t instanceof Element)) return;
		const el = root.value;
		const btn = t.closest('.code-block-copy');
		if (!el || !(btn instanceof HTMLButtonElement) || !el.contains(btn)) return;
		const pre = btn.closest('pre');
		if (!(pre instanceof HTMLElement)) return;
		const text = getCodePlainText(pre);
		if (!text) return;
		const ui = shellUi(toValue(locale));
		void navigator.clipboard.writeText(text).then(() => {
			if (!btn.isConnected) return;
			const idleEl = btn.querySelector('.code-block-copy__state--idle');
			const doneEl = btn.querySelector('.code-block-copy__state--done');
			window.clearTimeout(feedbackTimer);
			btn.classList.add('code-block-copy--success');
			btn.setAttribute('aria-label', ui.copiedCode);
			idleEl?.setAttribute('hidden', '');
			doneEl?.removeAttribute('hidden');
			feedbackTimer = window.setTimeout(() => {
				btn.classList.remove('code-block-copy--success');
				btn.setAttribute('aria-label', ui.copyCode);
				idleEl?.removeAttribute('hidden');
				doneEl?.setAttribute('hidden', '');
			}, 1600);
		}, () => undefined);
	}

	watch(
		[root, () => toValue(locale), () => toValue(contentKey)],
		(_v, _o, onCleanup) => {
			if (import.meta.env.SSR) return;
			const el = root.value;
			if (!el) return;
			mountCodeBlockCopy(el, shellUi(toValue(locale)).copyCode);
			el.addEventListener('click', onClick);
			onCleanup(() => {
				el.removeEventListener('click', onClick);
				unmountCodeBlockCopy(el);
				window.clearTimeout(feedbackTimer);
			});
		},
		{ flush: 'post', immediate: true },
	);
}
