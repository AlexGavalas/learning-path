import { createClient } from '@libsql/client/web';
import invariant from 'tiny-invariant';

invariant(
    typeof process.env.TURSO_DATABASE_URL === 'string',
    'No TURSO_DATABASE_URL found',
);

invariant(
    typeof process.env.TURSO_AUTH_TOKEN === 'string',
    'No TURSO_AUTH_TOKEN found',
);

export const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});
