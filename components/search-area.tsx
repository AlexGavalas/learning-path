import type { Dispatch, FormEventHandler, SetStateAction } from 'react';
import { useEffect, useRef } from 'react';

import type { Post } from '../lib/posts';

const QUERY_FIELD_NAME = 'query';

export const SearchArea = ({
    posts,
    setPosts,
}: {
    posts: Post[];
    setPosts: Dispatch<SetStateAction<Post[]>>;
}) => {
    const queryEl = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === '/') {
                e.stopImmediatePropagation();
                queryEl.current?.focus();
            }
        };

        document.addEventListener('keyup', handler);

        return () => {
            document.removeEventListener('keyup', handler);
        };
    }, []);

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const userQuery = formData.get(QUERY_FIELD_NAME);

        if (!userQuery) {
            return setPosts(posts);
        }

        const query = new RegExp(userQuery.toString(), 'i');

        const filteredPosts = posts.filter(({ title }) => query.test(title));

        setPosts(filteredPosts);
    };

    return (
        <form onSubmit={onSubmit} className="relative h-8 flex items-center">
            <input
                name={QUERY_FIELD_NAME}
                ref={queryEl}
                className="pl-2 h-full w-full border-[1px] dark:border-0 border-solid bg-transparent dark:bg-neutral-800 rounded dark:placeholder-gray-300 dark:placeholder-opacity-50"
                autoComplete="off"
                placeholder="Search notes"
            />
            <button className="cursor-pointer h-6 absolute right-1 bg-transparent rounded border-0 text-black dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600">
                Search
            </button>
        </form>
    );
};
