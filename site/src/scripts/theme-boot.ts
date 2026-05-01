/** 首帧主题：阻塞脚本，须在首帧绘制前设置 data-theme（外链经构建压缩为单行 JS） */

type Theme = 'light' | 'dark';

function systemTheme(): Theme {
	try {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	} catch {
		return 'light';
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
})();
