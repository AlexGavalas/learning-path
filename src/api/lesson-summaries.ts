import { getEntryBySlug } from 'astro:content';

import { supabase } from '~lib/supabase';
import type {
    LessonSummary,
    LessonSummaryRenderResult,
} from '~types/lesson-summaries.types';

import { fetchFileFromStorage } from './helpers';

export const getLessonSummaries = async (): Promise<LessonSummary[] | null> => {
    const { data: summaries, error } = await supabase
        .from('lesson_summaries_meta')
        .select('*')
        .order('updated', { ascending: false });

    if (error !== null) {
        return null;
    }

    return summaries;
};

export const getLessonSummaryData = async (
    slug: string,
): Promise<string | LessonSummaryRenderResult> => {
    const isProd = process.env.PROD === 'true';
    const isPublicFileServerEnabled =
        process.env.PUBLIC_FILE_SERVER_ENABLED === 'true';

    if (isProd && isPublicFileServerEnabled) {
        const filePath = `${slug}.md`;

        return await fetchFileFromStorage(`summaries/${filePath}`);
    }

    const lessonSummary = await getEntryBySlug('lesson-summaries', slug);

    return (await lessonSummary?.render()) ?? '';
};
