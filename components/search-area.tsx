import type { Dispatch, FormEventHandler, SetStateAction } from 'react';

import type { Post } from '../lib/posts';

const QUERY_FIELD_NAME = 'query';

export const SearchArea = ({
    posts,
    setPosts,
}: {
    posts: Post[];
    setPosts: Dispatch<SetStateAction<Post[]>>;
}) => {
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
                className="pl-2 h-full w-full border-[1px] border-solid dark:border-0 rounded dark:placeholder-gray-300 dark:placeholder-opacity-50"
                autoComplete="off"
                placeholder="What are you looking for?"
            />
            <button className="cursor-pointer h-6 absolute right-1 bg-transparent rounded border-0 bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-800">
                Search
            </button>
        </form>
    );
};
