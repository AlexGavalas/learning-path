import { getEntryBySlug } from 'astro:content';

import { supabase } from '~lib/supabase';
import type { LessonSummary } from '~types/lesson-summaries.types';

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

export const getLessonSummaryData = async (slug: string): Promise<string> => {
    const isProd = process.env.PROD === 'true';

    if (isProd) {
        const filePath = `${slug}.md`;

        return await fetchFileFromStorage(`summaries/${filePath}`);
    }

    const lessonSummary = await getEntryBySlug('lesson-summaries', slug);

    return lessonSummary?.body ?? '';
};
