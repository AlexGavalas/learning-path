import type { GetServerSideProps } from 'next';
import { useState, FormEventHandler, useRef } from 'react';

import Layout from '@components/layout';
import { Textarea } from '@components/textarea';
import { Button } from '@components/button';
import { Loader } from '@components/loader';
import { supabase } from '@lib/supabase';
import { useUser } from '@lib/use-user';
import { Feed as FeedList } from '../features/feed';

interface FeedProps {
    posts: Post[];
    isLoggedIn: boolean;
}

const MAX_CHARS = 256;

export const getServerSideProps: GetServerSideProps<FeedProps> = async ({
    req,
}) => {
    const { user } = await supabase.auth.api.getUserByCookie(req);

    const { data } = await supabase
        .from<Post>('posts')
        .select('*')
        .order('created_at', { ascending: false });

    return {
        props: {
            posts: data || [],
            isLoggedIn: !!user,
        },
    };
};

const Feed = ({ posts: initialPosts, isLoggedIn }: FeedProps) => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [hasUser, setHasUser] = useState(isLoggedIn);
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const { user, userLoaded } = useUser();

    const addNewNote: FormEventHandler<HTMLFormElement> = async (e) => {
        setSubmitting(true);

        e.preventDefault();

        if (!formRef.current) return;

        const user = supabase.auth.user();

        const post = new FormData(formRef.current).get('post');

        if (!post || !user) return;

        const payload = {
            post: post.toString().slice(0, MAX_CHARS),
            name: user.user_metadata.name,
        };

        const { data, error } = await supabase
            .from<Post>('posts')
            .insert(payload);

        if (!error) {
            formRef.current.reset();

            const [newDoc] = data;

            // Optimistic state update
            setPosts((prev) => [newDoc, ...prev]);
        }

        setSubmitting(false);
    };

    const userExists = Boolean(userLoaded && (user || hasUser));

    const onPostDelete = async (id: string) => {
        const { error } = await supabase.from('posts').delete().match({ id });

        if (!error) {
            setPosts((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const onPostUpdate = async (id: string, newPost: string) => {
        const { error } = await supabase
            .from<Post>('posts')
            .update({ post: newPost })
            .eq('id', id);

        if (!error) {
            setPosts((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, post: newPost } : item
                )
            );
        }
    };

    return (
        <Layout>
            <section className="leading-8 text-xl relative">
                <h2 className="my-8 text-black dark:text-white">Feed</h2>
                <p className="text-black dark:text-white">
                    Here you can post anything you find interesting for everyone
                    to see. Any content will live for 5 days . Use this section
                    for stuff like TIL, etc...
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
                <FeedList
                    posts={posts}
                    onPostDelete={onPostDelete}
                    onPostUpdate={onPostUpdate}
                />
            </section>
        </Layout>
    );
};

export default Feed;
