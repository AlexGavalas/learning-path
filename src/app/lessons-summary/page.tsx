import { compileMDX } from 'next-mdx-remote/rsc';

import { NotesList } from '~features/notes-list';
import { supabase } from '~lib/supabase';
import { type MarkdownMeta } from '~types/notes.types';

import { staticMetadata } from '../constants';

// export const runtime = 'edge';

export const metadata = staticMetadata;

type StorageApi = ReturnType<typeof supabase.storage.from>;
type StorageApiData = Awaited<ReturnType<StorageApi['list']>>['data'];

function nonNullable<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined;
}

const getFiles = async (filenames: StorageApiData) => {
    const files = await Promise.all(
        filenames?.map(async ({ name }) => {
            const content = await supabase.storage
                .from('summaries_md_files')
                .download(name);

            const markdown = await compileMDX<MarkdownMeta>({
                source: (await content.data?.text()) || '',
                options: {
                    parseFrontmatter: true,
                },
            });

            if (!markdown.frontmatter.published) {
                return;
            }

            return {
                filename: name.replace(/\.md$/, ''),
                updated: markdown.frontmatter.updated,
                title: markdown.frontmatter.title,
                markdown,
                content,
            };
        }) ?? [],
    );

    return files.filter(nonNullable);
};

const LessonsSummaryPage = async () => {
    const { data: summaries, error } = await supabase.storage
        .from('summaries_md_files')
        .list();

    if (error) {
        throw error;
    }

    const files = await getFiles(summaries);

    return (
        <section className="text-xl leading-8">
            <h2 className="my-8 text-black dark:text-white">
                Lessons Summaries
            </h2>
            <p className="p-2 text-center">
                This is where I will try to summarise the things I learn. Either
                from online courses or from an interesting article I read, I
                keep the things I find interesting here.
            </p>
            <NotesList
                baseUrl="lessons-summary"
                notes={files}
                timeZone="Europe/Athens"
            />
        </section>
    );
};

export default LessonsSummaryPage;
