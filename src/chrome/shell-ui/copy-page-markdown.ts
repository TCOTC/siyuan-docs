import { stripLeadingUtf8Bom } from '../../lib/utf8Bom';

export type CopyPageMarkdownControls = {
	triggerWithFeedback: () => void;
};

async function copyMainAsMarkdown(): Promise<boolean> {
	const fromPage = (window as Window & { __DOC_PAGE_MARKDOWN__?: string }).__DOC_PAGE_MARKDOWN__;
	if (fromPage && fromPage.trim()) {
		try {
			await navigator.clipboard.writeText(fromPage);
			return true;
		} catch {
			/* 回退到 fetch / innerText */
		}
	}
	const btn = document.getElementById('copy-page-md');
	const mdSrc = btn?.getAttribute('data-copy-md-src');
	if (mdSrc) {
		try {
			const res = await fetch(mdSrc, { credentials: 'same-origin' });
			if (!res.ok) return false;
			const text = stripLeadingUtf8Bom(await res.text());
			if (!text) return false;
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			return false;
		}
	}
	const main = document.getElementById('main-content');
	if (!main) return false;
	const plain = main.innerText.replace(/\s+\n/g, '\n').trim();
	if (!plain) return false;
	try {
		await navigator.clipboard.writeText(plain);
		return true;
	} catch {
		return false;
	}
}

/** 整页 Markdown 复制按钮与 `.js-copy-page-md` 委托 */
export function mountCopyPageMarkdown(signal: AbortSignal): CopyPageMarkdownControls {
	let copyFeedbackTimer: number | undefined;

	function flashCopyPageMdFeedback(success: boolean): void {
		const copyPageMdBtn = document.getElementById('copy-page-md');
		if (!copyPageMdBtn) return;
		copyPageMdBtn.classList.remove('copy-split__main--success', 'copy-split__main--error');
		copyPageMdBtn.classList.add(success ? 'copy-split__main--success' : 'copy-split__main--error');
		window.clearTimeout(copyFeedbackTimer);
		copyFeedbackTimer = window.setTimeout(() => {
			copyPageMdBtn.classList.remove('copy-split__main--success', 'copy-split__main--error');
		}, 1600);
	}

	function triggerWithFeedback(): void {
		void copyMainAsMarkdown().then((ok) => {
			flashCopyPageMdFeedback(ok);
		});
	}

	document.addEventListener(
		'click',
		(e: MouseEvent) => {
			const t = e.target;
			if (!(t instanceof Element) || !t.closest('.js-copy-page-md')) return;
			triggerWithFeedback();
		},
		{ signal },
	);

	return { triggerWithFeedback };
}
