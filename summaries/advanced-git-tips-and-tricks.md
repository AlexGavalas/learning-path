---
title: Advanced git tips and tricks
created: '2023-05-21'
updated: '2023-05-21'
published: true
---

# Advanced git tips and tricks

Lesson watched on Pluralsight ([link](https://app.pluralsight.com/library/courses/git-advanced-tips-tricks/table-of-contents)).

Search for commits that changed the specific function:

```bash
git log -L:function:file
```

It knows which parser to use based on either the builtin defaults or the `.gitattributes` configuration.

Search for commits that contain the pattern in a modifed line:

```bash
git log -G ".*pattern.*"
```

`-S` to search only for lines added or removed.

`git blame file -L10,20` to use line ranges.
`git blame file -L:function` for function blame.

`git rerere` to reuse a conflict resolutions.
