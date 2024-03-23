import { getCollection, getEntryBySlug } from 'astro:content';

import { turso } from '~lib/turso';
import type {
    LessonSummary,
    LessonSummaryFrontmatter,
    LessonSummaryRenderResult,
} from '~types/lesson-summaries.types';

import { fetchFileFromStorage } from './helpers';

export const getLessonSummaries = async (): Promise<
    Omit<LessonSummary, 'id'>[] | null
> => {
    const isProd = process.env.PROD === 'true';

    if (!isProd) {
        const entries = await getCollection('lesson-summaries');

        return entries.map((entry) => ({
            ...entry.data,
            filename: entry.slug,
        }));
    }

    const { rows } = await turso.execute(
        'SELECT * FROM lesson_summaries ORDER BY created DESC',
    );

    return rows as unknown as LessonSummary[];
};

export const getLessonSummaryData = async (
    slug: string,
): Promise<{
    content: string | LessonSummaryRenderResult;
    frontmatter?: LessonSummaryFrontmatter;
}> => {
    const isProd = process.env.PROD === 'true';
    const isPublicFileServerEnabled =
        process.env.PUBLIC_FILE_SERVER_ENABLED === 'true';

    if (isProd && isPublicFileServerEnabled) {
        const filePath = `${slug}.mdx`;

        return {
            content: await fetchFileFromStorage(`summaries/${filePath}`),
        };
    }

    const lessonSummary = await getEntryBySlug('lesson-summaries', slug);

    return {
        content: (await lessonSummary?.render()) ?? '',
        frontmatter: lessonSummary?.data,
    };
};

export const getLessonSummaryMetadata = async (
    filename: string,
): Promise<LessonSummaryFrontmatter | null> => {
    const isProd = process.env.PROD === 'true';

    if (!isProd) {
        const entry = await getEntryBySlug('lesson-summaries', filename);

        return entry?.data ?? null;
    }

    const { rows } = await turso.execute({
        sql: 'SELECT * FROM lesson_summaries WHERE filename = ? LIMIT 1',
        args: [filename],
    });

    return rows[0] as unknown as LessonSummaryFrontmatter;
};
