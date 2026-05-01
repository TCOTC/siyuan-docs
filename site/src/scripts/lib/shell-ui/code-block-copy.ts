type CodeCopyI18n = { copyAria: string; copiedAria: string; failedAria: string };

const CODE_COPY_FALLBACK: CodeCopyI18n = {
	copyAria: 'Copy code',
	copiedAria: 'Copied',
	failedAria: 'Copy failed',
};

function readCodeCopyI18n(): CodeCopyI18n {
	const el = document.getElementById('siyuan-code-copy-i18n');
	const raw = el?.textContent?.trim();
	if (!raw) return CODE_COPY_FALLBACK;
	try {
		const j = JSON.parse(raw) as Record<string, unknown>;
		return {
			copyAria: typeof j.copyAria === 'string' ? j.copyAria : CODE_COPY_FALLBACK.copyAria,
			copiedAria:
				typeof j.copiedAria === 'string' ? j.copiedAria : CODE_COPY_FALLBACK.copiedAria,
			failedAria: typeof j.failedAria === 'string' ? j.failedAria : CODE_COPY_FALLBACK.failedAria,
		};
	} catch {
		return CODE_COPY_FALLBACK;
	}
}

/** 为 `.prose pre` 注入代码块复制按钮 */
export function mountCodeBlockCopy(): void {
	const { copyAria, copiedAria, failedAria } = readCodeCopyI18n();
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
