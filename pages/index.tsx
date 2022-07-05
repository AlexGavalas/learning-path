import type { NextPage, GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';

import Date from '@components/date';
import Layout from '@components/layout';
import { ListItem } from '@components/list-item';
import { SearchArea } from '@components/search-area';
import { getSortedPosts, Post } from '@lib/posts';

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
                <p className="text-center p-2">
                    Hey there. 👋 This is a place where I keep all the
                    interesting stuff I come across. Feel free to explore. It is
                    a WIP, so you can expect things to change.
                </p>
                <SearchArea
                    posts={allPosts}
                    setPosts={setPosts}
                    setLines={setLines}
                />
                <h2 className="my-8 text-black dark:text-white">Notes</h2>
                {posts.length > 0 ? (
                    <ul className="list-none p-0">
                        {posts.map(({ id, updated, title }) => (
                            <li className="my-6" key={id}>
                                <Link href={`/posts/${id}`}>
                                    <a className="text-teal-500 dark:text-yellow-500">
                                        {title}
                                    </a>
                                </Link>
                                <br />
                                <small className="text-gray-600 dark:text-gray-300">
                                    Updated: <Date dateString={updated} />
                                </small>
                                {lines[title] && (
                                    <ul>
                                        {lines[title].map((line) => {
                                            return (
                                                <ListItem key={line}>
                                                    {line}
                                                </ListItem>
                                            );
                                        })}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">No notes found</p>
                )}
            </section>
        </Layout>
    );
};

export default Home;
