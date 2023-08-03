import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
    schema: z.object({
        title: z.string(),
        created: z.string(),
        updated: z.string(),
        published: z.boolean().optional(),
    }),
});

const lessonSummaries = defineCollection({
    schema: z.object({
        title: z.string(),
        created: z.string(),
        updated: z.string(),
        published: z.boolean().optional(),
        features: z.array(z.enum(['banner'])).optional(),
    }),
});

export const collections = {
    notes,
    'lesson-summaries': lessonSummaries,
};
