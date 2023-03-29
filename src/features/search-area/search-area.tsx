import { useRouter } from 'next/router';
import {
    type FormEventHandler,
    type MouseEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { Button } from '~components/button';
import { Input } from '~components/input';
import { Loader } from '~components/loader';
import { useKeypress } from '~hooks/use-keypress';

const QUERY_FIELD_NAME = 'q';

export const SearchArea = () => {
    const router = useRouter();
    const queryEl = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState(
        () => router.query[QUERY_FIELD_NAME]?.toString() ?? '',
    );
    const [loading, setLoading] = useState(false);

    const keyPressHandler = useCallback((e: KeyboardEvent) => {
        e.stopImmediatePropagation();
        queryEl.current?.focus();
    }, []);

    useEffect(() => {
        setLoading(false);

        setQuery(router.query[QUERY_FIELD_NAME]?.toString() ?? '');
    }, [router.asPath, router.query]);

    useKeypress('/', keyPressHandler);

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        setLoading(true);

        const url = new URL(location.href);

        if (query) {
            url.searchParams.set(QUERY_FIELD_NAME, query);
        } else {
            url.searchParams.delete(QUERY_FIELD_NAME);
        }

        await router.push(url);
    };

    const onClear: MouseEventHandler<HTMLButtonElement> = async () => {
        setQuery('');

        queryEl.current?.focus();

        if (router.query[QUERY_FIELD_NAME]?.toString()) {
            const url = new URL(location.href);

            url.searchParams.delete(QUERY_FIELD_NAME);

            await router.push(url);
        }
    };

    return (
        <form onSubmit={onSubmit} className="relative flex h-16 items-center">
            <Input
                label="Search notes"
                name={QUERY_FIELD_NAME}
                ref={queryEl}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
                placeholder="Type here"
            />
            <div className="absolute bottom-0 right-0 flex h-1/2 gap-2 p-1">
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
