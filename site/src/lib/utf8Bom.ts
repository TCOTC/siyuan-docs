/** UTF-8 BOM；静态 `.md` 在无 charset 时仍便于常见浏览器按 UTF-8 解码。 */
export const UTF8_BOM = '\uFEFF';

/** 去掉 fetch 正文首部的 BOM（与 `UTF8_BOM` 成对使用，例如写入剪贴板前）。 */
export function stripLeadingUtf8Bom(s: string): string {
	return s.startsWith(UTF8_BOM) ? s.slice(UTF8_BOM.length) : s;
}
