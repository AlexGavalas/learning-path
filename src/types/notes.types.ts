import type { CollectionEntry } from 'astro:content';

import type { Database } from '~types/database.types';

export type Note = Database['public']['Tables']['notes']['Row'];

export type NotesCollection = CollectionEntry<'notes'>;

export type NoteFrontmatter = NotesCollection['data'];
