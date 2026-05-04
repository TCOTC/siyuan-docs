import { zhShellUi } from '../i18n/zh';
import { enShellUi } from '../i18n/en';
import type { ShellUi } from '../i18n/types';
import { pickByAppLocale, type AppLocale } from './appLocale';

export type { ShellUi };

export function shellUi(locale: AppLocale): ShellUi {
	return pickByAppLocale(locale, { en: enShellUi, zh: zhShellUi });
}
