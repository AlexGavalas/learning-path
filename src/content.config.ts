// @ts-expect-error - TS config needs to be updated for this to recognize its types
import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    loader: glob({ base: './src/content/notes', pattern: '**/*.mdx' }),
    schema: z.object({
        created: z.string(),
        published: z.boolean().optional(),
        title: z.string(),
        updated: z.string(),
    }),
});

const summaries = defineCollection({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    loader: glob({ base: './src/content/summaries', pattern: '**/*.mdx' }),
    schema: z.object({
        created: z.string(),
        features: z.array(z.enum(['banner'])).optional(),
        published: z.boolean().optional(),
        title: z.string(),
        updated: z.string(),
    }),
});

export const collections = {
    notes,
    summaries,
};
