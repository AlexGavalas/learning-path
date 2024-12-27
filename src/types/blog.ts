import type { CollectionEntry } from 'astro:content';

export type BlogArticle = {
    created: string;
    filename: string;
    id: number;
    title: string;
    updated: string;
};

export type BlogArticleCollection = CollectionEntry<'blog'>;

export type BlogArticleFrontmatter = BlogArticleCollection['data'];
