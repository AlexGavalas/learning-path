import type { NextApiHandler } from 'next';

import { supabase } from '../../../lib/supabase';

interface Note {
    title: string;
}

const handler: NextApiHandler = async (req, res) => {
    const { q } = req.query;

    const query = Array.isArray(q) ? q[0] : q;

    const { data } = await supabase.rpc<Note>('search_notes', {
        q: query,
    });

    res.json({
        data: data?.map(({ title }) => title) || [],
    });
};

export default handler;
