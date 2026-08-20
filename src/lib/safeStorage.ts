/**
 * 访问 Storage 在私密模式等场景下可能抛错，集中封装避免各处散落 try/catch。
 */

export function safeLocalGet(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

export function safeLocalSet(key: string, value: string): void {
	try {
		localStorage.setItem(key, value);
	} catch {
		/* 私密模式等 */
	}
}
