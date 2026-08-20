export const NAV_GROUP_KEYS = [
	'intro',
	'plugin',
	'theme',
	'bazaar',
	'icons',
	'templates',
	'widgets',
] as const;

export type NavGroupKey = (typeof NAV_GROUP_KEYS)[number];

export function navGroupKeyFromStem(stem: string): NavGroupKey {
	const first = stem.split('/')[0] ?? '';
	if ((NAV_GROUP_KEYS as readonly string[]).includes(first)) return first as NavGroupKey;
	return 'intro';
}
