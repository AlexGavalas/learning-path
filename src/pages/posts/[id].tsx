import { type GetStaticPaths, type GetStaticProps, type NextPage } from 'next';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Button } from '~components/button';
import { Layout } from '~components/layout';
import { components } from '~components/mdx';
import { PostHeader } from '~features/post-header';
import { getAllPostIds, getPostData } from '~lib/posts';

import { type NoteMDX } from '../../../types/notes.types';

type PostPageProps = {
    post: NoteMDX;
};

export const getStaticProps: GetStaticProps<
    PostPageProps,
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

const PostPage: NextPage<PostPageProps> = ({ post }) => {
    const router = useRouter();

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
            <Button variant="link" onClick={router.back}>
                &#x21dc; Back to home
            </Button>
        </Layout>
    );
};

export default PostPage;
