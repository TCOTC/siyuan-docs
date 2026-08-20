import { onMounted, onUnmounted } from 'vue';
import { safeLocalGet, safeLocalSet } from '../lib/safeStorage';

const THEME_STORAGE_KEY = 'siyuan-docs-theme';

type DocsTheme = 'dark' | 'light';

function getSystemTheme(): DocsTheme {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getTheme(): DocsTheme {
	return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** 手动选择主题并写入 localStorage（清除该键后恢复按系统 prefers-color-scheme） */
function setTheme(next: DocsTheme): void {
	document.documentElement.setAttribute('data-theme', next);
	safeLocalSet(THEME_STORAGE_KEY, next);
}

function toggleTheme(): void {
	setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

function applySystemThemeIfUnpinned(): void {
	const t = safeLocalGet(THEME_STORAGE_KEY);
	if (t === 'light' || t === 'dark') return;
	document.documentElement.setAttribute('data-theme', getSystemTheme());
}

/** 跟随系统配色，并同步其它标签页对主题键的修改 */
function bindThemeSync(signal: AbortSignal): void {
	const mq = window.matchMedia('(prefers-color-scheme: dark)');
	mq.addEventListener('change', applySystemThemeIfUnpinned, { signal });
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
}

export function useTheme(): { toggleTheme: () => void } {
	const ac = new AbortController();
	onMounted(() => {
		bindThemeSync(ac.signal);
	});
	onUnmounted(() => {
		ac.abort();
	});
	return { toggleTheme };
}
