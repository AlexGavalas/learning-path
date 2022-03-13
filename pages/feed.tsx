import type { NextPage, GetServerSideProps } from 'next';
import { useState, FormEventHandler, useRef, useEffect } from 'react';
import { intervalToDuration, add } from 'date-fns';
import { query as q } from 'faunadb';

import Layout from '@components/layout';
import { Textarea } from '@components/textarea';
import { Button } from '@components/button';
import { Loader } from '@components/loader';
import { supabase } from '@lib/supabase';
import { fauna } from '@lib/fauna';
import { useUser } from '@lib/use-user';
import { Feed as FeedList } from '../features/feed';

interface FeedProps {
    isLoggedIn: boolean;
}

type QueryResult = {
    data: {
        data: Post;
        ts: number;
        ref: { id: string };
    }[];
};

export const getServerSideProps: GetServerSideProps<FeedProps> = async ({
    req,
}) => {
    const { user } = await supabase.auth.api.getUserByCookie(req);

    return {
        props: {
            isLoggedIn: !!user,
        },
    };
};

const MAX_CHARS = 256;
const EXPIRE_AFTER_SECS = 60 * 60 * 24 * 5;

const Feed: NextPage<FeedProps> = ({ isLoggedIn }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [hasUser, setHasUser] = useState(isLoggedIn);
    const [submitting, setSubmitting] = useState(false);
    const [fetchingPosts, setFetchingPosts] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const { user, userLoaded } = useUser();

    useEffect(() => {
        const getPosts = async () => {
            setFetchingPosts(true);

            const { data: posts } = await fauna.query<QueryResult>(
                q.Map(
                    q.Paginate(q.Match(q.Index('posts_by_ts'))),
                    q.Lambda(['ts', 'ref'], q.Get(q.Var('ref')))
                )
            );

            const result = posts.map(({ data, ts, ref }) => ({
                ...data,
                ts: ts / 1000,
                id: ref.id,
            }));

            setPosts(result);
            setFetchingPosts(false);
        };

        getPosts();
    }, []);

    const addNewNote: FormEventHandler<HTMLFormElement> = async (e) => {
        try {
            setSubmitting(true);

            e.preventDefault();

            if (!formRef.current) return;

            const user = supabase.auth.user();

            const post = new FormData(formRef.current).get('post');

            if (!post || !user) return;

            const data = {
                post: post.toString().slice(0, MAX_CHARS),
                name: user.user_metadata.name,
            };

            const newDoc = await fauna.query<Post & { ref: { id: string } }>(
                q.Create(q.Collection('posts'), {
                    data,
                })
            );

            formRef.current.reset();

            // Optimistic state update
            setPosts((prev) => [
                {
                    ...data,
                    ts: Date.now(),
                    id: newDoc.ref.id,
                },
                ...prev,
            ]);
        } catch (e) {
        } finally {
            setSubmitting(false);
        }
    };

    const userExists = Boolean(userLoaded && (user || hasUser));

    const onPostDelete = (id: string) => {
        setPosts((prev) => prev.filter((item) => item.id !== id));
    };

    const onPostUpdate = (id: string, newPost: string) => {
        setPosts((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, post: newPost } : item
            )
        );
    };

    return (
        <Layout>
            <section className="leading-8 text-xl relative">
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
                {fetchingPosts ? (
                    <Loader />
                ) : (
                    <FeedList
                        posts={posts}
                        onPostDelete={onPostDelete}
                        onPostUpdate={onPostUpdate}
                    />
                )}
            </section>
        </Layout>
    );
};

export default Feed;
