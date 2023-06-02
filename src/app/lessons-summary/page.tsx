import { NotesList } from '~features/notes-list';
import { supabase } from '~lib/supabase';

import { TITLE, staticMetadata } from '../constants';

export const runtime = 'edge';

export const metadata = {
    ...staticMetadata,
    title: `Lesson summaries | ${TITLE}`,
};

const LessonsSummaryPage = async () => {
    const { data: summaries, error } = await supabase
        .from('lesson_summaries_meta')
        .select('*')
        .order('updated', { ascending: false });

    if (error) {
        throw error;
    }

    return (
        <section className="text-xl leading-8">
            <h2 className="my-8 text-black dark:text-white">
                Lesson Summaries
            </h2>
            <p className="p-2 text-center">
                This is where I will try to summarise the things I learn. Either
                from online courses or from an interesting article I read, I
                keep the things I find interesting here.
            </p>
            <NotesList
                baseUrl="lessons-summary"
                notes={summaries}
                timeZone="Europe/Athens"
            />
        </section>
    );
};

export default LessonsSummaryPage;
