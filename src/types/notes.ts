import type { CollectionEntry } from 'astro:content';

export type Note = {
    id: string;
    created: string;
    title: string;
    updated: string;
};

export type NoteDBEntry = Note & {
    line: string;
};

export type NotesCollection = CollectionEntry<'notes'>;

export type NoteFrontmatter = NotesCollection['data'];
