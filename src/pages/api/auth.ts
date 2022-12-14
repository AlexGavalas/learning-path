import type { NextApiHandler } from 'next';

import { supabase } from '~lib/supabase';

const handler: NextApiHandler = async () => {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        supabase.auth.setSession(session);
    }
};

export default handler;
