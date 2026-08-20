let pageMarkdown = '';

export function setPageMarkdown(markdown: string): void {
	pageMarkdown = markdown;
}

export function clearPageMarkdown(): void {
	pageMarkdown = '';
}

async function writeClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}

/** 优先当前文档 Markdown；若尚未写入则回退为正文纯文本 */
export async function copyPageMarkdown(): Promise<boolean> {
	const fromPage = pageMarkdown.trim();
	if (fromPage) return writeClipboard(fromPage);
	const main = document.getElementById('main-content');
	if (!main) return false;
	const plain = main.innerText.replace(/\s+\n/g, '\n').trim();
	if (!plain) return false;
	return writeClipboard(plain);
}
