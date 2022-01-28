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
    const [loading, setLoading] = useState(false);

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

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        if (!query) {
            return setPosts(posts);
        }

        setLoading(true);

        try {
            const response = await fetch(`/api/search?query=${query}`);
            const json = await response.json();

            const filteredPosts = posts.filter(({ title }) =>
                json.data.includes(title)
            );

            setPosts(filteredPosts);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
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
            {loading && (
                <div className="animate-loader bg-no-repeat bg-center bg-gradient-to-r from-white via-[#4675aa] to-white bg-[length:25%_100%] w-full h-[2px] absolute bottom-[-8px]" />
            )}
        </form>
    );
};
