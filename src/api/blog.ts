import { parse } from '@formkit/tempo';
import { getCollection } from 'astro:content';

import type { BlogArticle } from '~types/blog';

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
