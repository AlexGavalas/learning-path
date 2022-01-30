import type { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';

import Layout from '../../components/layout';
import Date from '../../components/date';
import { getAllPostIds, getPostData, Post } from '../../lib/posts';
import { YoutubeIcon } from '../../components/icons';

const components = {
    YoutubeIcon: YoutubeIcon,
};

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
                <div className="prose dark:prose-invert">
                    <MDXRemote
                        {...postData.mdxSource}
                        components={components}
                    />
                </div>
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
