import type { NextApiHandler } from 'next';

import { supabase } from '../../lib/supabase';

const handler: NextApiHandler = (req, res) => {
    supabase.auth.api.setAuthCookie(req, res);
};

export default handler;
