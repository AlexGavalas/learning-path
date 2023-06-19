import {
    type FormEventHandler,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { Button } from '~components/button';
import { Input } from '~components/input';
import { Loader } from '~components/loader';
import { QUERY_FIELD_NAME } from '~constants';
import { useKeypress } from '~hooks/use-keypress';

export const SearchArea = ({ q }: { q: string }): JSX.Element => {
    const queryEl = useRef<HTMLInputElement | null>(null);

    const [query, setQuery] = useState(q);
    const [loading, setLoading] = useState(false);

    const keyPressHandler = useCallback((e: KeyboardEvent) => {
        e.stopImmediatePropagation();
        queryEl.current?.focus();
    }, []);

    useEffect(() => {
        setLoading(false);
    }, [q]);

    useKeypress('/', keyPressHandler);

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        setLoading(true);

        const url = new URL(location.href);

        if (query.length > 0) {
            url.searchParams.set(QUERY_FIELD_NAME, query);
        } else {
            url.searchParams.delete(QUERY_FIELD_NAME);
        }

        window.location.href = url.toString();
    };

    return (
        <form onSubmit={onSubmit} className="relative flex h-16 items-center">
            <Input
                label="Search notes"
                name={QUERY_FIELD_NAME}
                ref={queryEl}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
                autoFocus={query.length > 0}
                autoComplete="off"
                placeholder="Type here"
            />
            <div className="absolute bottom-0 right-0 flex h-1/2 gap-2 p-1 text-sm">
                <Button>Search</Button>
            </div>
            {loading && <Loader />}
        </form>
    );
};
