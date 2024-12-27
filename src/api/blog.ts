import { parse } from '@formkit/tempo';
import type { AstroComponentFactory } from 'astro/dist/runtime/server';
import { getCollection, getEntry, render } from 'astro:content';

import type { BlogArticle, BlogArticleFrontmatter } from '~types/blog';

export const getBlogArticles = async (): Promise<
    Omit<BlogArticle, 'id'>[] | null
> => {
    const isProd = process.env.PROD === 'true';

    const entries = await getCollection('blog');

    return entries
        .filter((entry) => (isProd ? entry.data.published : true))
        .map((entry) => ({
            ...entry.data,
            filename: entry.id,
        }))
        .sort(
            (articleA, articleB) =>
                parse(articleB.created, 'YYYY-MM-DD').getTime() -
                parse(articleA.created, 'YYYY-MM-DD').getTime(),
        );
};

export const geBlogData = async (
    slug: string,
): Promise<{
    content: { Content: AstroComponentFactory };
    frontmatter: BlogArticleFrontmatter;
} | null> => {
    const blogArticle = await getEntry('blog', slug);

    if (!blogArticle) {
        return null;
    }

    return {
        content: await render(blogArticle),
        frontmatter: blogArticle.data,
    };
};
