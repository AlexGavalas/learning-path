import { get } from '@vercel/edge-config';

import { Layout } from '~components/layout';
import { Banner } from '~features/banner';
import { NotesList } from '~features/notes-list';
import { SearchArea } from '~features/search-area';
import { supabase } from '~lib/supabase';
import { type Note } from '~types/notes.types';

type Lines = Record<string, string[]>;

// export const config: PageConfig = {
//     runtime: 'experimental-edge',
// };

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

const BASE_URL = 'Learning Path';

const Home = async ({ searchParams }: { searchParams: { q?: string } }) => {
    const { notes, lines } = await fetchNotes(searchParams.q);

    const title = searchParams.q ? `${searchParams.q} | ${BASE_URL}` : BASE_URL;

    return (
        <Layout>
            <title>{title}</title>
            <section className="text-xl leading-8">
                <Banner />
                <SearchArea />
                <h2 className="my-8 text-black dark:text-white">Notes</h2>
                <NotesList
                    lines={lines}
                    notes={notes}
                    timeZone="Europe/Athens"
                />
            </section>
        </Layout>
    );
};

export default Home;
