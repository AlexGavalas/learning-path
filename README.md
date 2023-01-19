# Learning Path

Hey there. 👋 This is a place where I keep all the interesting stuff I come across. Feel free to explore. It is a WIP, so you can expect things to change.

### Open tasks

-   `<html>` lang is set on the client and not SSRed. Due to the fact that `_document` can't be used with `edge` runtime for some reason and configuring `i18n` in `next.config.mjs` results in a weird `500` error (related issue is [#42854](https://github.com/vercel/next.js/issues/42854)).
-   `note/[id]` pages are generated reading the filesystem. I should migrate this info to the database.