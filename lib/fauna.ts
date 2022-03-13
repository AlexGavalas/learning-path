import faunadb from 'faunadb';

const isDev = process.env.NODE_ENV === 'development';

export const fauna = new faunadb.Client({
    secret: process.env.NEXT_PUBLIC_FAUNA_SECRET,
    ...(isDev && { domain: 'db.eu.fauna.com' }),
});
