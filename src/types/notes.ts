import type { CollectionEntry } from 'astro:content';

export type Note = {
    created: string;
    filename: string;
    title: string;
    updated: string;
};

export type NotesCollection = CollectionEntry<'notes'>;

export type NoteFrontmatter = NotesCollection['data'];
