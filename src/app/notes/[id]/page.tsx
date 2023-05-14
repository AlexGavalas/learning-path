import { type Metadata } from 'next';
import { compileMDX } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

import { components } from '~components/mdx';
import { NoteHeader } from '~features/note-header';
import { getAllNoteIds, getNoteData } from '~lib/notes';
import { type NoteMDX } from '~types/notes.types';

import { TITLE, staticMetadata } from '../../constants';

export const generateStaticParams = async () => {
    const ids = await getAllNoteIds();

    return ids ?? [];
};

export const generateMetadata = async ({
    params,
}: {
    params: { id?: string };
}): Promise<Metadata> => {
    if (!params.id) {
        notFound();
    }

    const note = await getNoteData(params.id);

    if (!note) {
        notFound();
    }

    const noteMdx = await compileMDX<NoteMDX>({
        source: note,
        options: {
            parseFrontmatter: true,
        },
    });

    return {
        ...staticMetadata,
        title: `${noteMdx.frontmatter.title} | ${TITLE}`,
    };
};

const NotePage = async ({ params }: { params: { id?: string } }) => {
    if (!params.id) {
        notFound();
    }

    const note = await getNoteData(params.id);

    if (!note) {
        notFound();
    }

    const compiledMDX = await compileMDX<NoteMDX>({
        source: note,
        components,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                rehypePlugins: [
                    [rehypeExternalLinks, { target: '_blank' }],
                    [rehypeSlug],
                    [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                ],
            },
        },
    });

    return (
        <>
            <article>
                <NoteHeader
                    title={compiledMDX.frontmatter.title}
                    created={compiledMDX.frontmatter.created}
                    updated={compiledMDX.frontmatter.updated}
                    timeZone="Europe/Athens"
                />
                <div className="heading dark:dark-heading prose dark:prose-invert prose-headings:text-light-primary prose-li:marker:text-light-primary dark:prose-headings:text-dark-primary dark:prose-li:marker:text-dark-primary">
                    {compiledMDX.content}
                </div>
            </article>
            <Link
                href="/"
                className="my-8 inline-block cursor-pointer bg-transparent p-0 text-lg text-light-primary hover:underline dark:text-dark-primary"
            >
                &#x21dc; Back to home
            </Link>
        </>
    );
};

export default NotePage;
