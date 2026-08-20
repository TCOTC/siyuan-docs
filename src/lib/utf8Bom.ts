export const UTF8_BOM = '\uFEFF';

export function stripLeadingUtf8Bom(s: string): string {
	return s.startsWith(UTF8_BOM) ? s.slice(UTF8_BOM.length) : s;
}
