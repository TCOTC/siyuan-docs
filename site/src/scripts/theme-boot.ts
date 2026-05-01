/** 首帧主题：阻塞脚本，须在首帧绘制前设置 data-theme（外链经构建压缩为单行 JS） */

type Theme = 'light' | 'dark';

function systemTheme(): Theme {
	try {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	} catch {
		return 'light';
	}
}

type DeviceKind = 'apple' | 'unknown';

/** 与 anchored-floating-hint 等一致：按平台判定，覆盖 macOS / iOS 上各浏览器引擎 */
function deviceKind(): DeviceKind {
	try {
		const nav = navigator;
		const platform = (nav as Navigator & { userAgentData?: { platform: string } }).userAgentData
			?.platform;
		if (platform === 'macOS' || platform === 'iOS') return 'apple';
		if (/iPhone|iPad|iPod|Macintosh/.test(nav.userAgent)) return 'apple';
		return 'unknown';
	} catch {
		return 'unknown';
	}
}

(function boot(): void {
	try {
		const stored = localStorage.getItem('siyuan-docs-theme');
		const theme: Theme =
			stored === 'light' || stored === 'dark' ? stored : systemTheme();
		document.documentElement.setAttribute('data-theme', theme);
	} catch {
		document.documentElement.setAttribute('data-theme', systemTheme());
	}
	try {
		document.documentElement.setAttribute('data-device', deviceKind());
	} catch {
		document.documentElement.setAttribute('data-device', 'unknown');
	}
})();
