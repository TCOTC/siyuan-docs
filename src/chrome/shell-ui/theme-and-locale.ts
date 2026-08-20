import { onMediaQueryChange } from '../media-query';
import { normalizeLocale } from '../../lib/localePreference';
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
export function mountShellThemeAndLocale(signal: AbortSignal): void {
	const mqColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
	onMediaQueryChange(mqColorScheme, applySystemThemeIfUnpinned, signal);

	window.addEventListener(
		'storage',
		(e: StorageEvent) => {
			if (e.key !== THEME_STORAGE_KEY) return;
			const v = e.newValue;
			if (v === 'light' || v === 'dark') {
				document.documentElement.setAttribute('data-theme', v);
			} else {
				document.documentElement.setAttribute('data-theme', getSystemTheme());
			}
		},
		{ signal },
	);

	document.addEventListener(
		'click',
		(e: MouseEvent) => {
			const t = e.target;
			if (!(t instanceof Element)) return;
			if (t.closest('[data-theme-toggle]')) {
				setTheme(getTheme() === 'dark' ? 'light' : 'dark');
				return;
			}
			const a = t.closest('a[data-lang-locale]');
			if (!a) return;
			const loc = a.getAttribute('data-lang-locale');
			const normalized = loc ? normalizeLocale(loc) : null;
			if (normalized) {
				safeLocalSet('siyuan-docs-locale', normalized);
			}
		},
		{ signal },
	);
}
