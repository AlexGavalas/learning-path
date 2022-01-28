import type { NextApiHandler } from 'next';

import { supabase } from '../../../lib/supabase';

interface Note {
    title: string;
}

const handler: NextApiHandler = async (req, res) => {
    const { q } = req.query;

    console.log({ q });

    const { data, ...rest } = await supabase.rpc<Note>('search_notes', {
        q,
    });

    console.log({ data, ...rest });

    res.json({
        data: data?.map(({ title }) => title) || [],
    });
};

export default handler;
