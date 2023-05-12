import { type GetStaticPaths, type GetStaticProps, type NextPage } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import Link from 'next/link';

import { Layout } from '~components/layout';
import { components } from '~components/mdx';
import { NoteHeader } from '~features/note-header';
import { getAllNoteIds, getNoteData } from '~lib/notes';
import { type NoteMDX } from '~types/notes.types';

type NotePageProps = {
    note: NoteMDX;
};

export const getStaticProps: GetStaticProps<
    NotePageProps,
    { id: string }
> = async ({ params }) => {
    if (!params?.id) {
        return {
            notFound: true,
        };
    }

    const note = await getNoteData(params.id);

    return {
        props: {
            note,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = await getAllNoteIds();

    return {
        paths,
        fallback: false,
    };
};

const NotePage: NextPage<NotePageProps> = ({ note }) => {
    return (
        <Layout>
            <Head>
                <title>{note.title}</title>
            </Head>
            <article>
                <NoteHeader note={note} timeZone="Europe/Athens" />
                <div className="heading dark:dark-heading prose dark:prose-invert prose-headings:text-light-primary prose-li:marker:text-light-primary dark:prose-headings:text-dark-primary dark:prose-li:marker:text-dark-primary">
                    <MDXRemote {...note.mdxSource} components={components} />
                </div>
            </article>
            <Link href="/">&#x21dc; Back to home</Link>
        </Layout>
    );
};

export default NotePage;
