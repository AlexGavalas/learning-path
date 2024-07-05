import type { CollectionEntry, Render } from 'astro:content';

export type Summary = {
    created: string;
    filename: string;
    id: number;
    title: string;
    updated: string;
};

export type SummariesCollection = CollectionEntry<'summaries'>;

export type SummaryFrontmatter = SummariesCollection['data'];

export type SummaryRenderResult = Awaited<Render['.mdx']>;
