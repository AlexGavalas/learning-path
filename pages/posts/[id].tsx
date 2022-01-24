import type { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../../components/layout';
import Date from '../../components/date';
import { getAllPostIds, getPostData, Post } from '../../lib/posts';

export const getStaticProps: GetStaticProps<
    { postData: Post },
    { id: string }
> = async ({ params }) => {
    if (!params || !params.id) {
        return {
            notFound: true,
        };
    }

    const postData = await getPostData(params.id);

    return {
        props: {
            postData,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds();

    return {
        paths,
        fallback: false,
    };
};

const Post = ({ postData }: { postData: Post }) => {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className="my-8">{postData.title}</h1>
                <div className="text-gray-500 flex gap-2 mb-4">
                    <p>
                        Created at <Date dateString={postData.date} />
                    </p>
                    <p> / </p>
                    <p>
                        Updated at <Date dateString={postData.updated} />
                    </p>
                </div>
                <div
                    dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                    className="prose dark:prose-invert"
                />
            </article>
            <div className="my-8">
                <Link href="/">
                    <a>← Back to home</a>
                </Link>
            </div>
        </Layout>
    );
};

export default Post;
