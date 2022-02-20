import type { NextPage, GetServerSideProps } from 'next';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useState, useEffect, FormEventHandler } from 'react';
import { intervalToDuration, add } from 'date-fns';

import Layout from '../components/layout';
import { Input } from '../components/input';
import { supabase } from '../lib/supabase';
import { redis } from '../lib/redis';
import { useUser } from '../lib/use-user';

interface PostContent {
    post: string;
    name: string;
}

interface Post {
    data: PostContent;
    key: string;
}

interface FeedProps {
    posts: Post[];
    isLoggedIn: boolean;
}

export const getServerSideProps: GetServerSideProps<FeedProps> = async ({
    req,
}) => {
    const { user } = await supabase.auth.api.getUserByCookie(req);
    const { data } = await redis.keys('posts:*');

    const posts: Post[] = [];

    for (const key of data) {
        const { data } = await redis.get(key);

        // Type casting needed because I can't set the type on the client.get
        posts.push({ data: JSON.parse(data) as unknown as PostContent, key });
    }

    return {
        props: {
            posts: [],
            isLoggedIn: !!user,
        },
    };
};

const MAX_CHARS = 256;
const EXPIRE_AFTER_SECS = 60 * 60 * 24 * 5;

const Feed: NextPage<FeedProps> = ({ posts: initialPosts, isLoggedIn }) => {
    const [posts, setPosts] = useState(initialPosts);
    const [hasUser, setHasUser] = useState(isLoggedIn);

    const { user, userLoaded } = useUser();

    const addNewNote: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const user = supabase.auth.user();

        const post = new FormData(e.currentTarget).get('post');

        if (!post || !user) return;

        const key = `posts:${Date.now()}`;

        const data = {
            post: post.toString().slice(0, MAX_CHARS),
            name: user.user_metadata.name,
        };

        redis.set(key, JSON.stringify(data));
        redis.expire(key, EXPIRE_AFTER_SECS);

        e.currentTarget.reset();

        // Optimistic state update
        setPosts((prev) => [{ data, key }, ...prev]);
    };

    const userExists = Boolean(userLoaded && (user || hasUser));

    return (
        <Layout>
            <section className="leading-8 text-xl">
                <h2 className="my-8 text-black dark:text-white">Feed</h2>
                <p className="text-black dark:text-white">
                    Here you can post anything you find interesting for everyone
                    to see. Any content will live for{' '}
                    {
                        intervalToDuration({
                            start: new Date(),
                            end: add(new Date(), {
                                seconds: EXPIRE_AFTER_SECS,
                            }),
                        }).days
                    }{' '}
                    days . Use this section for stuff like TIL, etc...
                </p>
                {userExists ? (
                    <form className="relative h-8 flex" onSubmit={addNewNote}>
                        <Input
                            name="post"
                            placeholder={`Post anything (max ${MAX_CHARS} characters)`}
                            autoComplete="off"
                        />
                        <div className="h-full p-1 absolute right-0 flex gap-2">
                            <button className="rounded border-0 text-black dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600">
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setHasUser(false);
                                    supabase.auth.signOut();
                                }}
                            >
                                Sign out
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="flex items-center gap-4 h-full">
                        <p className="m-0 text-black dark:text-white">
                            Login to be able to post
                        </p>
                        <button
                            className="h-8 rounded border-0 text-black dark:text-white hover:bg-gray-300 bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-600"
                            onClick={() => {
                                supabase.auth.signIn(
                                    { provider: 'google' },
                                    {
                                        redirectTo: `${window.location.origin}/feed`,
                                    }
                                );
                            }}
                        >
                            Login with Google
                        </button>
                    </div>
                )}
                <ul className="mt-4">
                    {posts.map(({ data: { post, name }, key }) => (
                        <li
                            key={key}
                            className="list-none border-0 border-b-2 border-solid py-4"
                        >
                            {name}: {post}
                        </li>
                    ))}
                </ul>
            </section>
        </Layout>
    );
};

export default Feed;
