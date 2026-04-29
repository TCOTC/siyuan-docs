import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		/** 侧栏排序，数字越小越靠前 */
		order: z.number().default(99),
	}),
});

export const collections = { docs };
