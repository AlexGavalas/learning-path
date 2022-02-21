import type { NextPage, GetServerSideProps } from 'next';
import { useState, FormEventHandler, useRef } from 'react';
import { intervalToDuration, add } from 'date-fns';

import Layout from '../components/layout';
import { Feed as FeedList } from '../features/feed';
import { Textarea } from '../components/textarea';
import { Button } from '../components/button';
import { Loader } from '../components/loader';
import { supabase } from '../lib/supabase';
import { redis } from '../lib/redis';
import { useUser } from '../lib/use-user';

interface FeedProps {
    posts: Post[];
    isLoggedIn: boolean;
}

export const getServerSideProps: GetServerSideProps<FeedProps> = async ({
    req,
}) => {
    const { user } = await supabase.auth.api.getUserByCookie(req);

    const { data: redisKeys } = await redis.keys('posts:*');

    const redisData = await Promise.all(
        redisKeys.map((key: string) => redis.get(key))
    );

    const posts: Post[] = redisData
        .map(({ data }, i) => ({
            data: JSON.parse(data) as unknown as PostContent,
            key: redisKeys[i],
        }))
        .sort((a, b) => {
            const [, tsA] = a.key.split(':');
            const [, tsB] = b.key.split(':');

            return tsB - tsA;
        });

    return {
        props: {
            posts,
            isLoggedIn: !!user,
        },
    };
};

const MAX_CHARS = 256;
const EXPIRE_AFTER_SECS = 60 * 60 * 24 * 5;

const Feed: NextPage<FeedProps> = ({ posts: initialPosts, isLoggedIn }) => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [hasUser, setHasUser] = useState(isLoggedIn);
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const { user, userLoaded } = useUser();

    const addNewNote: FormEventHandler<HTMLFormElement> = async (e) => {
        try {
            setSubmitting(true);

            e.preventDefault();

            if (!formRef.current) return;

            const user = supabase.auth.user();

            const post = new FormData(formRef.current).get('post');

            if (!post || !user) return;

            const key = `posts:${Date.now()}`;

            const data = {
                post: post.toString().slice(0, MAX_CHARS),
                name: user.user_metadata.name,
            };

            const { error } = await redis.set(key, JSON.stringify(data));

            if (error) return;

            await redis.expire(key, EXPIRE_AFTER_SECS);

            formRef.current.reset();

            // Optimistic state update
            setPosts((prev) => [{ data, key }, ...prev]);
        } catch (e) {
        } finally {
            setSubmitting(false);
        }
    };

    const userExists = Boolean(userLoaded && (user || hasUser));

    const onPostDelete = (key: string) => {
        setPosts((prev) => prev.filter((item) => item.key !== key));
    };

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
                    <form
                        className="relative flex flex-col"
                        onSubmit={addNewNote}
                        ref={formRef}
                    >
                        <Textarea
                            name="post"
                            placeholder={`Post anything (max ${MAX_CHARS} characters)`}
                        />
                        {submitting && <Loader />}
                        <div className="h-8 py-1 flex gap-2 justify-between">
                            <Button
                                type="button"
                                variant="danger"
                                onClick={() => {
                                    setHasUser(false);
                                    supabase.auth.signOut();
                                }}
                            >
                                Sign out
                            </Button>
                            <Button>Post it</Button>
                        </div>
                    </form>
                ) : (
                    <div className="flex items-center gap-4 h-full">
                        <p className="m-0 text-black dark:text-white">
                            Login to be able to post
                        </p>
                        <Button
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
                        </Button>
                    </div>
                )}
                <FeedList posts={posts} onPostDelete={onPostDelete} />
            </section>
        </Layout>
    );
};

export default Feed;
