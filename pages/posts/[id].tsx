import type { GetStaticProps, GetStaticPaths } from 'next';
import { AnchorHTMLAttributes } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote';

import { Layout } from '@components/layout';
import { FormattedDate } from '@components/formatted-date';
import { getAllPostIds, getPostData, Post } from '@lib/posts';
import { YoutubeIcon } from '@components/icons';

// Custom link component to use next's Link for internal routing
const CustomLink = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const { href } = props;

    const isInternalLink =
        href && (href.startsWith('/') || href.startsWith('#'));

    if (isInternalLink) {
        return (
            <Link href={href} {...props}>
                {props.children}
            </Link>
        );
    }

    return <a {...props} />;
};

const components = {
    YoutubeIcon: YoutubeIcon,
    a: CustomLink,
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
                        Created at <FormattedDate dateString={postData.date} />
                    </p>
                    <p> / </p>
                    <p>
                        Updated at{' '}
                        <FormattedDate dateString={postData.updated} />
                    </p>
                </div>
                <div className="prose dark:prose-invert prose-headings:text-teal-500 dark:prose-headings:text-yellow-500 prose-li:marker:text-teal-500 dark:prose-li:marker:text-yellow-500 heading dark:dark-heading">
                    <MDXRemote
                        {...postData.mdxSource}
                        components={components}
                    />
                </div>
            </article>
            <div className="my-8">
                <Link href="/" className="text-teal-500 dark:text-yellow-500">
                    &#x21dc; Back to home
                </Link>
            </div>
        </Layout>
    );
};

export default Post;
