import { createClient } from '@supabase/supabase-js';
import invariant from 'tiny-invariant';

import type { Database } from '~types/database.types';

invariant(
    typeof process.env.PUBLIC_SUPABASE_URL === 'string',
    'No PUBLIC_SUPABASE_URL found',
);

invariant(
    typeof process.env.PUBLIC_SUPABASE_ANON_KEY === 'string',
    'No PUBLIC_SUPABASE_ANON_KEY found',
);

export const supabase = createClient<Database>(
    process.env.PUBLIC_SUPABASE_URL,
    process.env.PUBLIC_SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: false,
        },
    },
);
