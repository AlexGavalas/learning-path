import type {
    Dispatch,
    FormEventHandler,
    MouseEventHandler,
    SetStateAction,
} from 'react';

import { useEffect, useState, useRef } from 'react';

import type { Post } from '@lib/posts';

import { supabase } from '@lib/supabase';
import { Button } from './button';
import { Input } from './input';
import { Loader } from './loader';

const QUERY_FIELD_NAME = 'query';

interface Note {
    title: string;
    line: string;
}

export const SearchArea = ({
    posts,
    setPosts,
    setLines,
}: {
    posts: Post[];
    setPosts: Dispatch<SetStateAction<Post[]>>;
    setLines: Dispatch<SetStateAction<Record<string, string[]>>>;
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
            setLines({});
            setPosts(posts);

            return;
        }

        setLoading(true);

        try {
            const { data } = await supabase.rpc('search_notes', { q: query });

            const lines =
                data?.reduce<Record<string, string[]>>(
                    (acc, { title, line }) => {
                        acc[title] = (acc[title] || []).concat(line);
                        return acc;
                    },
                    {}
                ) ?? {};

            const postTitles = data?.map(({ title }) => title) ?? [];

            const filteredPosts = posts.filter(({ title }) =>
                postTitles.includes(title)
            );

            setPosts(filteredPosts);
            setLines(lines);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const onClear: MouseEventHandler<HTMLButtonElement> = () => {
        setQuery('');
        setPosts(posts);
        setLines({});
    };

    return (
        <form onSubmit={onSubmit} className="relative h-8 flex items-center">
            <Input
                name={QUERY_FIELD_NAME}
                ref={queryEl}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                placeholder="Search notes"
            />
            <div className="h-full p-1 absolute right-0 flex gap-2">
                {query && (
                    <Button onClick={onClear} type="button">
                        Clear
                    </Button>
                )}
                <Button>Search</Button>
            </div>
            {loading && <Loader />}
        </form>
    );
};
