import { type GetServerSideProps, type NextPage, type PageConfig } from 'next';

import { Layout } from '~components/layout';
import { Banner } from '~features/banner';
import { PostsList } from '~features/posts-list';
import { SearchArea } from '~features/search-area';
import { supabase } from '~lib/supabase';

import { type Note } from '../../types/notes.types';

type Lines = Record<string, string[]>;

type HomeProps = {
    posts: Note[];
    lines: Lines;
    error?: boolean;
};

export const config: PageConfig = {
    runtime: 'experimental-edge',
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
    query,
}) => {
    const { data } = await supabase.rpc('get_notes_meta');

    const allPosts = data ?? [];

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
