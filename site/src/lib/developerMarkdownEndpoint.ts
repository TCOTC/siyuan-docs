import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { AppLocale } from './appLocale';
import { developerDocPath } from './developerDocPath';
import { getStrippedMarkdownSourceForDoc } from './developerDocStrippedMarkdown';

export async function developerMarkdownStaticPaths(locale: AppLocale) {
	const docs = await getCollection('docs');
	const prefix = `${locale}/`;
	return docs
		.filter((d) => d.id.startsWith(prefix))
		.map((doc) => {
			const pathSeg = developerDocPath(doc);
			const source = getStrippedMarkdownSourceForDoc(doc, { pageTitle: doc.data.title });
			return {
				params: { slug: pathSeg },
				props: { source },
			};
		});
}

export const developerMarkdownGet: APIRoute = async ({ props }) => {
	const text = typeof props.source === 'string' ? props.source : '';
	return new Response(text, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};
