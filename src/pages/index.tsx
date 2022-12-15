import type { NextPage, GetStaticProps } from 'next';
import { useState } from 'react';

import { Layout } from '~components/layout';
import { SearchArea } from '~features/search-area';
import { Banner } from '~features/banner';
import { PostsList } from '~features/posts-list';
import { getSortedPosts, Post } from '~lib/posts';

export const getStaticProps: GetStaticProps = async () => {
    const allPosts = getSortedPosts();

    return {
        props: {
            allPosts,
        },
    };
};

const Home: NextPage<{ allPosts: Post[] }> = ({ allPosts }) => {
    const [posts, setPosts] = useState(allPosts);
    const [lines, setLines] = useState<Record<string, string[]>>({});

    return (
        <Layout>
            <section className="leading-8 text-xl">
                <Banner />
                <SearchArea
                    posts={allPosts}
                    setPosts={setPosts}
                    setLines={setLines}
                />
                <h2 className="my-8 text-black dark:text-white">Notes</h2>
                <PostsList lines={lines} posts={posts} />
            </section>
        </Layout>
    );
};

export default Home;
