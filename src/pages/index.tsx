import { type GetServerSideProps, type NextPage } from 'next';

import { Layout } from '~components/layout';
import { Banner } from '~features/banner';
import { PostsList } from '~features/posts-list';
import { SearchArea } from '~features/search-area';
import { type Post, getSortedPosts } from '~lib/posts';
import { supabase } from '~lib/supabase';

type Lines = Record<string, string[]>;

type HomeProps = {
    posts: Post[];
    lines: Lines;
    error?: boolean;
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
    query,
}) => {
    const allPosts = getSortedPosts();

    const q = query.q?.toString();

    if (q) {
        const { data, error } = await supabase.rpc('search_notes', { q });

        if (error) {
            return {
                props: {
                    posts: [],
                    lines: {},
                    error: true,
                },
            };
        }

        const lines = data.reduce<Lines>((acc, { title, line }) => {
            acc[title] = (acc[title] || []).concat(line);
            return acc;
        }, {});

        const postTitles = new Set(data.map(({ title }) => title));

        const filteredPosts = allPosts.filter(({ title }) =>
            postTitles.has(title),
        );

        return {
            props: {
                posts: filteredPosts,
                lines,
            },
        };
    }

    return {
        props: {
            posts: allPosts,
            lines: {},
        },
    };
};

const Home: NextPage<HomeProps> = ({ posts, lines }) => {
    return (
        <Layout>
            <section className="leading-8 text-xl">
                <Banner />
                <SearchArea />
                <h2 className="my-8 text-black dark:text-white">Notes</h2>
                <PostsList lines={lines} posts={posts} />
            </section>
        </Layout>
    );
};

export default Home;
