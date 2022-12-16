import type { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';

import { Layout } from '~components/layout';
import { components } from '~components/mdx';
import { getAllPostIds, getPostData, Post } from '~lib/posts';
import { PostHeader } from '~features/post-header';

export const getStaticProps: GetStaticProps<
    { post: Post },
    { id: string }
> = async ({ params }) => {
    if (!params?.id) {
        return {
            notFound: true,
        };
    }

    const post = await getPostData(params.id);

    return {
        props: {
            post,
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

const PostPage = ({ post }: { post: Post }) => {
    return (
        <Layout>
            <Head>
                <title>{post.title}</title>
            </Head>
            <article>
                <PostHeader post={post} />
                <div className="prose dark:prose-invert prose-headings:text-teal-500 dark:prose-headings:text-yellow-500 prose-li:marker:text-teal-500 dark:prose-li:marker:text-yellow-500 heading dark:dark-heading">
                    <MDXRemote {...post.mdxSource} components={components} />
                </div>
            </article>
            <Link
                href="/"
                className="inline-block my-8 text-teal-500 dark:text-yellow-500"
                role="link"
            >
                &#x21dc; Back to home
            </Link>
        </Layout>
    );
};

export default PostPage;
