import { type GetStaticPaths, type GetStaticProps, type NextPage } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Button } from '~components/button';
import { Layout } from '~components/layout';
import { components } from '~components/mdx';
import { NoteHeader } from '~features/note-header';
// import { getAllNoteIds, getNoteData } from '~lib/notes';

import { type NoteMDX } from '../../../types/notes.types';

type NotePageProps = {
    note?: NoteMDX;
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

    // const note = await getNoteData(params.id);

    return {
        props: {
            // note,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    // const paths = getAllNoteIds();

    return {
        paths: [],
        fallback: false,
    };
};

const NotePage: NextPage<NotePageProps> = ({ note }) => {
    const router = useRouter();

    if (!note) return null;

    return (
        <Layout>
            <Head>
                <title>{note.title}</title>
            </Head>
            <article>
                <NoteHeader note={note} />
                <div className="heading dark:dark-heading prose prose-headings:text-teal-500 prose-li:marker:text-teal-500 dark:prose-invert dark:prose-headings:text-yellow-500 dark:prose-li:marker:text-yellow-500">
                    <MDXRemote {...note.mdxSource} components={components} />
                </div>
            </article>
            <Button variant="link" onClick={router.back}>
                &#x21dc; Back to home
            </Button>
        </Layout>
    );
};

export default NotePage;
