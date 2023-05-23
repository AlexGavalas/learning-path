---
title: Advanced git tips and tricks
created: '2023-05-21'
updated: '2023-05-23'
published: true
---

# Advanced git tips and tricks

Lesson watched on Pluralsight ([link](https://app.pluralsight.com/library/courses/git-advanced-tips-tricks/table-of-contents)).

I learned that you can search for commits that changed a specific function with

```bash
git log -L:function:file
```

It knows which parser to use based on either the builtin defaults or the `.gitattributes` configuration.

You can also search for commits that contain a pattern in a modifed line:

```bash
git log -G ".*pattern.*"
```

or use `-S` to search only in lines added or removed.

The previous can also be applied to `git blame`:

`git blame file -L10,20` to use line ranges.
`git blame file -L:function` for function blame.

A nice little known command is `git rerere` to reuse a conflict resolutions.
