import { enShellUi } from './en';
import { zhCNShellUi } from './zh-CN';
import type { ShellUi } from './types';
import type { AppLocale } from '../lib/locales';

const byLocale: Record<AppLocale, ShellUi> = {
	en: enShellUi,
	'zh-CN': zhCNShellUi,
};

export function shellUi(locale: AppLocale): ShellUi {
	return byLocale[locale];
}
