import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
