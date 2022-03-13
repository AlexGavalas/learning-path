import faunadb from 'faunadb';

export const fauna = new faunadb.Client({
    secret: process.env.NEXT_PUBLIC_FAUNA_SECRET,
    // domain: 'db.eu.fauna.com',
});
