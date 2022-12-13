import {
    Dispatch,
    FormEventHandler,
    MouseEventHandler,
    SetStateAction,
    useCallback,
} from 'react';

import { useState, useRef } from 'react';

import type { Post } from '~lib/posts';

import { supabase } from '~lib/supabase';
import { Button } from '~components/button';
import { Input } from '~components/input';
import { Loader } from '~components/loader';
import { useKeypress } from '~hooks/use-keypress';

const QUERY_FIELD_NAME = 'query';

type SearchAreaProps = {
    posts: Post[];
    setPosts: Dispatch<SetStateAction<Post[]>>;
    setLines: Dispatch<SetStateAction<Record<string, string[]>>>;
};

export const SearchArea = ({ posts, setPosts, setLines }: SearchAreaProps) => {
    const queryEl = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const keyPressHandler = useCallback((e: KeyboardEvent) => {
        e.stopImmediatePropagation();
        queryEl.current?.focus();
    }, []);

    useKeypress('/', keyPressHandler);

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
                    {},
                ) ?? {};

            const postTitles = data?.map(({ title }) => title) ?? [];

            const filteredPosts = posts.filter(({ title }) =>
                postTitles.includes(title),
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
        <form onSubmit={onSubmit} className="relative h-16 flex items-center">
            <Input
                label="Search notes"
                name={QUERY_FIELD_NAME}
                ref={queryEl}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                placeholder="Type here"
            />
            <div className="absolute right-0 bottom-0 h-1/2 flex gap-2 p-1">
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
