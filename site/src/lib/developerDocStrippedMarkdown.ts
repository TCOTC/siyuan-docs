import fs from 'node:fs';

/** 与「查看 Markdown」端点一致：读源文件并去掉 frontmatter 及紧随的一个空行 */
export interface DocSourceInput {
	filePath?: string;
	body?: string;
}

/** 去掉开头的 `---` frontmatter，并去掉紧随其后的一个空行（若有） */
export function stripYamlFrontmatterAndOneBlankLine(raw: string): string {
	const withoutBom = raw.replace(/^\uFEFF/, '');
	if (!withoutBom.startsWith('---')) return withoutBom;
	const m = withoutBom.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n(?:\r?\n)?/);
	if (!m) return withoutBom;
	return withoutBom.slice(m[0].length);
}

/** 正文是否已以 ATX 一级标题开头（与页面上单独渲染的 `h1` 二选一，避免重复） */
function bodyStartsWithAtxH1(markdownBody: string): boolean {
	return /^#\s+/.test(markdownBody.trimStart());
}

export interface StrippedMarkdownOptions {
	/** 与 `Shell` 中 `doc.data.title` 的 `h1` 对齐；仅当正文尚无一级 `#` 时插入 */
	pageTitle?: string | null;
}

/** 将 frontmatter 中的标题写成一行 `# …`，供插入正文前使用 */
function singleLineHeadingText(title: string): string {
	return title.trim().replace(/\s+/g, ' ');
}

export function getStrippedMarkdownSourceForDoc(
	doc: DocSourceInput,
	options?: StrippedMarkdownOptions,
): string {
	let source = '';
	if (doc.filePath) {
		try {
			source = fs.readFileSync(doc.filePath, 'utf8');
		} catch {
			source = doc.body ?? '';
		}
	} else {
		source = doc.body ?? '';
	}
	let body = stripYamlFrontmatterAndOneBlankLine(source);
	const pageTitle = options?.pageTitle?.trim();
	if (pageTitle && !bodyStartsWithAtxH1(body)) {
		body = `# ${singleLineHeadingText(pageTitle)}\n\n${body}`;
	}
	return body;
}
