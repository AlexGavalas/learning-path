import { type GetServerSideProps, type NextPage, type PageConfig } from 'next';

import { Layout } from '~components/layout';
import { Banner } from '~features/banner';
import { NotesList } from '~features/notes-list';
import { SearchArea } from '~features/search-area';
// import { supabase } from '~lib/supabase';

import { type Note } from '../../types/notes.types';

type Lines = Record<string, string[]>;

type HomeProps = {
    notes: Note[];
    lines: Lines;
    error?: boolean;
};

export const config: PageConfig = {
    runtime: 'experimental-edge',
};

// export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
//     query,
// }) => {
//     const { data } = await supabase.rpc('get_notes_meta');

//     const allNotes = data ?? [];

//     const q = query.q?.toString();

//     if (q) {
//         const { data, error } = await supabase.rpc('search_notes', { q });

//         if (error) {
//             return {
//                 props: {
//                     notes: [],
//                     lines: {},
//                     error: true,
//                 },
//             };
//         }

//         const lines = data.reduce<Lines>((acc, { title, line }) => {
//             acc[title] = (acc[title] || []).concat(line);
//             return acc;
//         }, {});

//         const noteTitles = new Set(data.map(({ title }) => title));

//         const filteredNotes = allNotes.filter(({ title }) =>
//             noteTitles.has(title),
//         );

//         return {
//             props: {
//                 notes: filteredNotes,
//                 lines,
//             },
//         };
//     }

//     return {
//         props: {
//             notes: allNotes,
//             lines: {},
//         },
//     };
// };

const Home: NextPage<HomeProps> = ({ notes = [], lines = {} }) => {
    return (
        <Layout>
            <section className="text-xl leading-8">
                <Banner />
                <SearchArea />
                <h2 className="my-8 text-black dark:text-white">Notes</h2>
                <NotesList lines={lines} notes={notes} />
            </section>
        </Layout>
    );
};

export default Home;
