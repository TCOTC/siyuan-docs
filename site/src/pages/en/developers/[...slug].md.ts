import type { APIRoute } from 'astro';
import { developerMarkdownGet, developerMarkdownStaticPaths } from '../../../lib/developerMarkdownEndpoint';

export const prerender = true;

export async function getStaticPaths() {
	return developerMarkdownStaticPaths('en');
}

export const GET: APIRoute = developerMarkdownGet;
