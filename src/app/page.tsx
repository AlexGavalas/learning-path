import { get } from '@vercel/edge-config';
import { type Metadata } from 'next';

import { Banner } from '~features/banner';
import { NotesList } from '~features/notes-list';
import { SearchArea } from '~features/search-area';
import { supabase } from '~lib/supabase';
import { type Note } from '~types/notes.types';

import { TITLE, staticMetadata } from './constants';

type Lines = Record<string, string[]>;

export const runtime = 'edge';

export const generateMetadata = ({
    searchParams,
}: {
    searchParams: { q?: string };
}): Metadata => {
    const title = searchParams.q ? `${searchParams.q} | ${TITLE}` : TITLE;

    return {
        title,
        ...staticMetadata,
    };
};

const fetchNotes = async (q?: string) => {
    const data = (await get('meta')) as Note[];

    const allNotes = data ?? [];

    if (q) {
        const { data, error } = await supabase.rpc('search_notes', { q });

        if (error) {
            return {
                notes: [],
                lines: {},
                error: true,
            };
        }

        const lines = data.reduce<Lines>((acc, { title, line }) => {
            acc[title] = (acc[title] || []).concat(line);
            return acc;
        }, {});

        const noteTitles = new Set(data.map(({ title }) => title));

        const filteredNotes = allNotes.filter(({ title }) =>
            noteTitles.has(title),
        );

        return {
            notes: filteredNotes,
            lines,
        };
    }

    return {
        notes: allNotes,
        lines: {},
    };
};

const Home = async ({ searchParams }: { searchParams: { q?: string } }) => {
    const { notes, lines } = await fetchNotes(searchParams.q);

    return (
        <section className="text-xl leading-8">
            <Banner />
            <SearchArea />
            <h2 className="my-8 text-black dark:text-white">Notes</h2>
            <NotesList
                lines={lines}
                notes={notes}
                baseUrl="notes"
                timeZone="Europe/Athens"
            />
        </section>
    );
};

export default Home;
