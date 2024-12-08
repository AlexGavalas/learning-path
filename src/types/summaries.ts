import type { CollectionEntry } from 'astro:content';

export type Summary = {
    created: string;
    filename: string;
    id: number;
    title: string;
    updated: string;
};

export type SummariesCollection = CollectionEntry<'summaries'>;

export type SummaryFrontmatter = SummariesCollection['data'];
