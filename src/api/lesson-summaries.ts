import { type CollectionEntry, getEntryBySlug } from 'astro:content';

import { supabase } from '~lib/supabase';
import type { LessonSummary } from '~types/lesson-summaries.types';

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

// Gets note data

type AstroRenderResult = Awaited<
    ReturnType<CollectionEntry<'lesson-summaries'>['render']>
>;

const getNoteDataFromStorage = async (
    filePath: string,
): Promise<string | null> => {
    const fileServerUrl = String(import.meta.env.PUBLIC_FILE_SERVER_URL);

    const response = await fetch(`${fileServerUrl}/summaries/${filePath}`);

    const fileContents = await response.text();

    return fileContents;
};

export const getLessonSummaryData = async (
    filename: string,
): Promise<AstroRenderResult | string | null> => {
    const isProd = import.meta.env.PROD;

    if (isProd) {
        const filePath = `${filename}.md`;

        return await getNoteDataFromStorage(filePath);
    }

    const lessonSummary = await getEntryBySlug('lesson-summaries', filename);
    const renderResult = await lessonSummary?.render();

    return renderResult ?? '';
};
