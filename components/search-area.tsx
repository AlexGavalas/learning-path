import type {
    Dispatch,
    FormEventHandler,
    MouseEventHandler,
    SetStateAction,
} from 'react';
import { useEffect, useState, useRef } from 'react';

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
    const [query, setQuery] = useState('');

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

        if (!query) {
            return setPosts(posts);
        }

        const userQuery = new RegExp(query, 'i');

        const filteredPosts = posts.filter(({ title }) =>
            userQuery.test(title)
        );

        setPosts(filteredPosts);
    };

    const onClear: MouseEventHandler<HTMLButtonElement> = () => {
        setQuery('');
        setPosts(posts);
    };

    return (
        <form onSubmit={onSubmit} className="relative h-8 flex items-center">
            <input
                name={QUERY_FIELD_NAME}
                ref={queryEl}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-2 h-full w-full border-[1px] dark:border-0 border-solid bg-transparent dark:bg-neutral-800 rounded dark:placeholder-gray-300 dark:placeholder-opacity-50"
                autoComplete="off"
                placeholder="Search notes"
            />
            <div className="h-full p-1 absolute right-0 flex gap-2">
                {query && (
                    <button
                        className="cursor-pointer rounded border-0 text-black dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600"
                        onClick={onClear}
                        type="button"
                    >
                        Clear
                    </button>
                )}
                <button className="cursor-pointer rounded border-0 text-black dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-600">
                    Search
                </button>
            </div>
        </form>
    );
};
