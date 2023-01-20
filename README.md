# Learning Path

Hey there. 👋 This is a place where I keep all the interesting stuff I come across. Feel free to explore. It is a WIP, so you can expect things to change.

## Open issues

-   `<html>` lang is set on the client and not SSRed. Due to the fact that `_document` can't be used with `edge` runtime for some reason and configuring `i18n` in `next.config.mjs` results in a weird `500` error (related issue is [#42854](https://github.com/vercel/next.js/issues/42854)).
-   `note/[id]` pages are generated reading the filesystem. I should migrate this info to the database.

## Ideas

-   Dynamic favicon for link, inspired by [Stefan Judis](https://www.stefanjudis.com/).
-   TIR = Today I Read section / TIL.
-   Get keywords from head meta to use in db.
-   Use git diff to update db.
-   Implement cookie consent banner for analytics.
-   Add inert polyfill to support firefox.
