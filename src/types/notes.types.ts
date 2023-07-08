import type { CollectionEntry, Render } from 'astro:content';

import type { Database } from '~types/database.types';

export type Note = Database['public']['Tables']['notes']['Row'];

export type NotesCollection = CollectionEntry<'notes'>;

export type NoteFrontmatter = NotesCollection['data'];

export type NoteRenderResult = Awaited<Render['.mdx' | '.md']>;
