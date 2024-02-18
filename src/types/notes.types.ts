import type { CollectionEntry, Render } from 'astro:content';

export type Note = {
    created: string;
    filename: string;
    line: string;
    title: string;
    updated: string;
};

export type NotesCollection = CollectionEntry<'notes'>;

export type NoteFrontmatter = NotesCollection['data'];

export type NoteRenderResult = Awaited<Render['.mdx']>;
