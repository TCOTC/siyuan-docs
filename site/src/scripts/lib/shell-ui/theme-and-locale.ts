import { onMediaQueryChange } from '../media-query';
import { safeLocalGet, safeLocalSet } from '../safe-storage';

const THEME_STORAGE_KEY = 'siyuan-docs-theme';

function getSystemTheme(): 'dark' | 'light' {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getTheme(): 'dark' | 'light' {
	return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** 手动选择主题并写入 localStorage（清除该键后恢复按系统 prefers-color-scheme） */
function setTheme(next: 'dark' | 'light'): void {
	document.documentElement.setAttribute('data-theme', next);
	safeLocalSet(THEME_STORAGE_KEY, next);
}

function applySystemThemeIfUnpinned(): void {
	const t = safeLocalGet(THEME_STORAGE_KEY);
	if (t === 'light' || t === 'dark') return;
	document.documentElement.setAttribute('data-theme', getSystemTheme());
}

/** 主题切换、跨标签 storage 同步、语言链接写入 locale 偏好 */
export function mountShellThemeAndLocale(): void {
	const mqColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
	onMediaQueryChange(mqColorScheme, applySystemThemeIfUnpinned);

	window.addEventListener('storage', (e: StorageEvent) => {
		if (e.key !== THEME_STORAGE_KEY) return;
		const v = e.newValue;
		if (v === 'light' || v === 'dark') {
			document.documentElement.setAttribute('data-theme', v);
		} else {
			document.documentElement.setAttribute('data-theme', getSystemTheme());
		}
	});

	for (const btn of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
		btn.addEventListener('click', () => {
			setTheme(getTheme() === 'dark' ? 'light' : 'dark');
		});
	}

	for (const a of document.querySelectorAll<HTMLAnchorElement>('a[data-lang-locale]')) {
		a.addEventListener('click', () => {
			const loc = a.getAttribute('data-lang-locale');
			if (loc === 'en' || loc === 'zh') {
				safeLocalSet('siyuan-docs-locale', loc);
			}
		});
	}
}
