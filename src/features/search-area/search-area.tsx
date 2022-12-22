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
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const keyPressHandler = useCallback((e: KeyboardEvent) => {
        e.stopImmediatePropagation();
        queryEl.current?.focus();
    }, []);

    useEffect(() => {
        setLoading(false);

        const q = router.query[QUERY_FIELD_NAME]?.toString();

        if (q) {
            setQuery(q);
        }
    }, [router.asPath, router.query]);

    useKeypress('/', keyPressHandler);

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        setLoading(true);

        const url = new URL(location.href);

        if (query) {
            url.searchParams.set(QUERY_FIELD_NAME, query);
        } else {
            url.searchParams.delete(QUERY_FIELD_NAME);
        }

        router.push(url);
    };

    const onClear: MouseEventHandler<HTMLButtonElement> = () => {
        setQuery('');

        const url = new URL(location.href);

        url.searchParams.delete(QUERY_FIELD_NAME);

        router.push(url);
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
