import type { NextPage, GetServerSideProps } from 'next';
import { useState, useCallback, FormEventHandler, useRef } from 'react';
import { intervalToDuration, add, format } from 'date-fns';

import Layout from '../components/layout';
import { Dialog } from '../components/dialog';
import { Textarea } from '../components/textarea';
import { Button } from '../components/button';
import { Loader } from '../components/loader';
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
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const keyToDelete = useRef<string>();

    const { user, userLoaded } = useUser();

    const closeDialog = useCallback(() => setOpenDialog(false), []);

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

    const handleDelete = async () => {
        const key = keyToDelete.current;

        if (!key) return;

        const { error } = await redis.del(key);

        if (error) {
            // TODO: Show an error to the user
            return;
        }

        setPosts((prev) => prev.filter((item) => item.key !== key));
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
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
                <ul className="mt-4">
                    {posts.length > 0 ? (
                        posts.map((post) => {
                            const {
                                data: { post: postData, name },
                                key,
                            } = post;

                            const [, timestamp] = key.split(':');

                            const postDate = format(
                                new Date(+timestamp),
                                'dd/MM/yyyy HH:mm'
                            );

                            const isMine = name === user?.user_metadata.name;

                            return (
                                <li
                                    key={key}
                                    className="list-none py-6 border-0 border-solid last:border-b-0 flex flex-col"
                                >
                                    <p className="border-solid border-0 border-l-2 border-l-[#4675aa] pl-4 break-words">
                                        {postData}
                                    </p>
                                    <div className="self-end flex gap-4 items-center">
                                        {isMine && (
                                            <div className="flex gap-2 h-5">
                                                <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                        setOpenDialog(true);
                                                        keyToDelete.current =
                                                            key;
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                                {/* <Button
                                                    onClick={() => {
                                                        handleEdit(post);
                                                    }}
                                                >
                                                    Edit
                                                </Button> */}
                                            </div>
                                        )}
                                        <p className="italic text-sm ">
                                            - {name} at {postDate}
                                        </p>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <p className="text-center">No posts yet</p>
                    )}
                </ul>
            </section>
            <Dialog open={openDialog} onClickOutside={closeDialog}>
                <p>Are you sure you want to delete?</p>
                <div className="flex gap-2 justify-end">
                    <Button onClick={closeDialog}>No</Button>
                    <Button
                        onClick={() => {
                            handleDelete();
                            closeDialog();
                        }}
                    >
                        Yes
                    </Button>
                </div>
            </Dialog>
        </Layout>
    );
};

export default Feed;
