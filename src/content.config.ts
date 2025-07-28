import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
    loader: glob({ base: './src/content/notes', pattern: '**/*.mdx' }),
    schema: z.object({
        created: z.string(),
        published: z.boolean().optional(),
        title: z.string(),
        updated: z.string(),
    }),
});

const summaries = defineCollection({
    loader: glob({ base: './src/content/summaries', pattern: '**/*.mdx' }),
    schema: z.object({
        created: z.string(),
        features: z.array(z.enum(['banner'])).optional(),
        published: z.boolean().optional(),
        title: z.string(),
        updated: z.string(),
    }),
});

const blog = defineCollection({
    loader: glob({ base: './src/content/blog', pattern: '**/*.mdx' }),
    schema: z.object({
        created: z.string(),
        features: z.array(z.enum(['banner'])).optional(),
        published: z.boolean().optional(),
        title: z.string(),
        updated: z.string(),
    }),
});

export const collections = {
    blog,
    notes,
    summaries,
};
