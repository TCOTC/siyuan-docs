import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { AppLocale } from './appLocale';
import { developerDocPath } from './developerDocPath';
import { getStrippedMarkdownSourceForDoc } from './developerDocStrippedMarkdown';
import { UTF8_BOM } from './utf8Bom';

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

/** 为静态 `.md` 加 BOM，避免无 charset 时乱码；常量与说明见 `utf8Bom` 模块。 */
export const developerMarkdownGet: APIRoute = async ({ props }) => {
	const text = typeof props.source === 'string' ? props.source : '';
	const body = text.length === 0 ? text : `${UTF8_BOM}${text}`;
	return new Response(body, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			'Cache-Control': 'public, max-age=3600',
		},
	});
};
