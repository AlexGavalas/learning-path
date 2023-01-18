import { type MDXRemoteSerializeResult } from 'next-mdx-remote';

import { type Database } from './database.types';

export type UserPost = {
    id: string;
    created_at: string;
    post: string;
    name: string;
};

export type Note = Database['public']['Tables']['notes']['Row'];

export type MarkdownMeta = {
    title: string;
    updated: string;
    date: string;
};

export type NoteMDX = Note & {
    mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
};
