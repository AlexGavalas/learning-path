import type { CollectionEntry, Render } from 'astro:content';

export type LessonSummary = {
    created: string;
    filename: string;
    id: number;
    title: string;
    updated: string;
};

export type LessonSummariesCollection = CollectionEntry<'lesson-summaries'>;

export type LessonSummaryFrontmatter = LessonSummariesCollection['data'];

export type LessonSummaryRenderResult = Awaited<Render['.mdx']>;
