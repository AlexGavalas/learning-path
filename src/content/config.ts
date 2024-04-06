import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
    schema: z.object({
        created: z.string(),
        published: z.boolean().optional(),
        title: z.string(),
        updated: z.string(),
    }),
});

const lessonSummaries = defineCollection({
    schema: z.object({
        created: z.string(),
        features: z.array(z.enum(['banner'])).optional(),
        published: z.boolean().optional(),
        title: z.string(),
        updated: z.string(),
    }),
});

export const collections = {
    'lesson-summaries': lessonSummaries,
    notes,
};
