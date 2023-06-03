import axios from 'axios';
import { type Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

import { NoteHeader } from '~features/note-header';
import { supabase } from '~lib/supabase';

import { TITLE, staticMetadata } from '../../constants';

export const generateMetadata = async ({
    params,
}: {
    params: { id?: string };
}): Promise<Metadata> => {
    if (!params.id) {
        notFound();
    }

    const { data: summaryMetadata, error: metaDataError } = await supabase
        .from('lesson_summaries_meta')
        .select('title')
        .eq('filename', params.id)
        .single();

    if (!summaryMetadata) {
        notFound();
    }

    if (metaDataError) {
        throw metaDataError;
    }

    return {
        ...staticMetadata,
        title: `${summaryMetadata.title} | ${TITLE}`,
    };
};

const LessonsSummary = async ({ params }: { params: { id?: string } }) => {
    if (!params.id) {
        notFound();
    }

    const filename = `${params.id}.md`;

    const { data: summaryMetadata, error: metaDataError } = await supabase
        .from('lesson_summaries_meta')
        .select('title, created, updated')
        .eq('filename', params.id)
        .single();

    if (metaDataError) {
        throw metaDataError;
    }

    const { data } = await axios.get<string>(
        `${process.env.FILE_SERVER_URL}/summaries/${filename}`,
    );

    return (
        <article>
            <NoteHeader
                title={summaryMetadata.title}
                created={summaryMetadata.created}
                updated={summaryMetadata.updated}
                timeZone="Europe/Athens"
            />
            <div className="heading dark:dark-heading prose dark:prose-invert prose-headings:text-light-primary prose-li:marker:text-light-primary dark:prose-headings:text-dark-primary dark:prose-li:marker:text-dark-primary">
                {/* @ts-expect-error React async component */}
                <MDXRemote
                    source={data}
                    options={{
                        parseFrontmatter: true,
                        mdxOptions: {
                            rehypePlugins: [
                                [rehypeExternalLinks, { target: '_blank' }],
                                [rehypeSlug],
                                [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                            ],
                        },
                    }}
                />
            </div>
            <Link
                href="/lessons-summary"
                className="my-8 inline-block cursor-pointer bg-transparent p-0 text-lg text-light-primary hover:underline dark:text-dark-primary"
            >
                &#x21dc; Back to home
            </Link>
        </article>
    );
};

export default LessonsSummary;
