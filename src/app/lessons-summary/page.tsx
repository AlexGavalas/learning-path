import { compileMDX } from 'next-mdx-remote/rsc';
import Link from 'next/link';

import { FormattedDate } from '~components/formatted-date';
import { supabase } from '~lib/supabase';
import { type NoteMDX } from '~types/notes.types';

import { staticMetadata } from '../constants';

// export const runtime = 'edge';

export const metadata = staticMetadata;

type StorageApi = ReturnType<typeof supabase.storage.from>;
type StorageApiData = Awaited<ReturnType<StorageApi['list']>>['data'];

const getFiles = async (filenames: StorageApiData) => {
    const files = await Promise.all(
        filenames?.map(async ({ name }) => {
            const content = await supabase.storage
                .from('summaries_md_files')
                .download(name);

            const markdown = await compileMDX<NoteMDX>({
                source: (await content.data?.text()) || '',
                options: {
                    parseFrontmatter: true,
                },
            });

            return {
                name: name.replace(/\.md$/, ''),
                markdown,
                content,
            };
        }) ?? [],
    );

    return files;
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
        <div>
            <h2 className="my-8 text-black dark:text-white">
                Lessons Summaries
            </h2>
            <ul className="list-none divide-x-0 divide-y-2 divide-solid divide-zinc-300 p-0 dark:divide-zinc-800">
                {files.map(({ markdown, name }) => (
                    <Link
                        key={name}
                        href={`/lessons-summary/${name}`}
                        className="hover:no-underline"
                        role="link"
                        prefetch={false}
                    >
                        <div className="group flex cursor-pointer items-center justify-between p-2 text-black hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-800">
                            <div className="flex flex-col-reverse gap-2 sm:flex-row">
                                <FormattedDate
                                    dateString={markdown.frontmatter.updated}
                                    format="dd/MM/yy"
                                    timeZone="Europe/Athens"
                                />
                                <span className="text-light-primary hover:no-underline dark:text-dark-primary">
                                    {markdown.frontmatter.title}
                                </span>
                            </div>
                            <span className="opacity-0 group-hover:animate-pulse">
                                &#x21dd;
                            </span>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default LessonsSummaryPage;
