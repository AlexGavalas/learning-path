import { compileMDX } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeSlug from 'rehype-slug';

import { NoteHeader } from '~features/note-header';
import { supabase } from '~lib/supabase';
import { type NoteMDX } from '~types/notes.types';

import { staticMetadata } from '../../constants';

export const metadata = staticMetadata;

const LessonsSummary = async ({ params }: { params: { id?: string } }) => {
    if (!params.id) {
        notFound();
    }

    const content = await supabase.storage
        .from('summaries_md_files')
        .download(params.id + '.md');

    if (content.error) {
        notFound();
    }

    const markdown = await compileMDX<NoteMDX>({
        source: await content.data.text(),
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
        <article>
            <NoteHeader
                title={markdown.frontmatter.title}
                created={markdown.frontmatter.created}
                updated={markdown.frontmatter.updated}
                timeZone="Europe/Athens"
            />
            <div className="heading dark:dark-heading prose dark:prose-invert prose-headings:text-light-primary prose-li:marker:text-light-primary dark:prose-headings:text-dark-primary dark:prose-li:marker:text-dark-primary">
                {markdown.content}
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
