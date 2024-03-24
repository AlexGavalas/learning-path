import { getCollection, getEntryBySlug } from 'astro:content';

import { turso } from '~lib/turso';
import type {
    LessonSummary,
    LessonSummaryFrontmatter,
    LessonSummaryRenderResult,
} from '~types/lesson-summaries.types';

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
    content: LessonSummaryRenderResult;
    frontmatter: LessonSummaryFrontmatter;
} | null> => {
    const lessonSummary = await getEntryBySlug('lesson-summaries', slug);

    if (lessonSummary === undefined) {
        return null;
    }

    return {
        content: await lessonSummary.render(),
        frontmatter: lessonSummary.data,
    };
};
