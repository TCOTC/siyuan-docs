import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
/** 仓库根目录 `developers/<locale>/` 下按 intro / plugin / theme / bazaar / icons / templates / widgets 等子目录存放 */
	loader: glob({ pattern: '**/*.md', base: '../developers' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		/** 侧栏排序，数字越小越靠前 */
		order: z.number().default(99),
	}),
});

export const collections = { docs };
