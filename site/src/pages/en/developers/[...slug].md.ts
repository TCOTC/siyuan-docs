import type { APIRoute } from 'astro';
import { developerMarkdownGet, developerMarkdownStaticPaths } from '../../../lib/developerMarkdownEndpoint';
import { appLocaleCode } from '../../../lib/appLocale';

export const prerender = true;

export async function getStaticPaths() {
	return developerMarkdownStaticPaths(appLocaleCode.en);
}

export const GET: APIRoute = developerMarkdownGet;
