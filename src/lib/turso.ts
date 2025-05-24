import { createClient } from '@libsql/client';

if (typeof process.env.TURSO_DATABASE_URL !== 'string') {
    throw new Error('No TURSO_DATABASE_URL found');
}

if (typeof process.env.TURSO_AUTH_TOKEN !== 'string') {
    throw new Error('No TURSO_AUTH_TOKEN found');
}

export const turso = createClient({
    authToken: process.env.TURSO_AUTH_TOKEN,
    url: process.env.TURSO_DATABASE_URL,
});
