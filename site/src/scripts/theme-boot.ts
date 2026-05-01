/**
 * 首帧主题：阻塞经典脚本（`Shell` 中 `kind="classic"`），须无顶层 `import`，否则 dev 下按普通 script 执行会语法错误。
 * 逻辑与 `lib/safe-storage`、`lib/device-platform` 对齐；此处内联以免拆包。
 */

type Theme = 'light' | 'dark';

const THEME_KEY = 'siyuan-docs-theme';

function safeLocalGet(key: string): string | null {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function systemTheme(): Theme {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function isApplePlatform(): boolean {
	try {
		const nav = navigator as Navigator & { userAgentData?: { platform: string } };
		const p = nav.userAgentData?.platform;
		if (p === 'macOS' || p === 'iOS') return true;
		return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
	} catch {
		return false;
	}
}

(function boot(): void {
	const stored = safeLocalGet(THEME_KEY);
	const theme: Theme = stored === 'light' || stored === 'dark' ? stored : systemTheme();
	document.documentElement.setAttribute('data-theme', theme);

	try {
		document.documentElement.setAttribute('data-device', isApplePlatform() ? 'apple' : 'unknown');
	} catch {
		document.documentElement.setAttribute('data-device', 'unknown');
	}
})();
