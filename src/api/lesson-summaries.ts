import { getCollection, getEntryBySlug } from 'astro:content';

import { supabase } from '~lib/supabase';
import type {
    LessonSummaryFrontmatter,
    LessonSummaryRenderResult,
} from '~types/lesson-summaries.types';

import { fetchFileFromStorage } from './helpers';

export const getLessonSummaries = async (): Promise<
    (LessonSummaryFrontmatter & { filename: string })[] | null
> => {
    const isProd = process.env.PROD === 'true';

    if (!isProd) {
        const entries = await getCollection('lesson-summaries');

        return entries.map((entry) => ({
            ...entry.data,
            filename: entry.slug,
        }));
    }

    const { data: summaries, error } = await supabase
        .from('lesson_summaries_meta')
        .select('*')
        .order('created', { ascending: false });

    if (error !== null) {
        return null;
    }

    return summaries;
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

    const { data, error } = await supabase
        .from('lesson_summaries_meta')
        .select('*')
        .eq('filename', filename)
        .limit(1)
        .maybeSingle();

    if (error !== null) {
        return null;
    }

    return data;
};
