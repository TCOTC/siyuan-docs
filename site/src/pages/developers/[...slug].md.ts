import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { developerDocPath } from '../../lib/developerDocPath';
import { getStrippedMarkdownSourceForDoc } from '../../lib/developerDocStrippedMarkdown';

export const prerender = true;

export async function getStaticPaths() {
	const docs = await getCollection('docs');
	return docs.map((doc) => {
		const pathSeg = developerDocPath(doc);
		const source = getStrippedMarkdownSourceForDoc(doc, { pageTitle: doc.data.title });
		return {
			params: { slug: pathSeg },
			props: { source },
		};
	});
}

export const GET: APIRoute = async ({ props }) => {
	const text = typeof props.source === 'string' ? props.source : '';
	return new Response(text, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};
