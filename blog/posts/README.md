# Sunny blog — how to add a post

Posts are plain Markdown files in this folder. Pushing a new `.md` file to
`main` triggers the **Build blog** GitHub Action, which regenerates the static
pages (`/blog/index.html` and `/blog/<slug>/index.html`) and commits them.
You can also build locally with:

```
node scripts/build-blog.js
```

## File format

Name the file anything you like (a `YYYY-MM-DD-slug.md` prefix keeps the
folder tidy). The post URL comes from `slug` in the front matter, or from the
filename if `slug` is omitted.

```markdown
---
title: The Dublin southside suntraps that hold light past 7pm
slug: dublin-southside-suntraps          # → sunnypubs.app/blog/dublin-southside-suntraps/
excerpt: One or two sentences shown on cards and used as the meta description.
category: Guide                          # Guide | Spotlight | News
city: Dublin                             # any city — new cities appear in the filter automatically
author: Aoife Brennan
date: 2026-06-06                         # YYYY-MM-DD, used for sorting
read: 6 min                              # optional — computed from word count if omitted
image: /assets/hero_garden.png           # optional photo (put files in /assets/)
gradient: sunset                         # used when there's no image: sunset | ember | golden | garden | peach | dusk
featured: true                           # optional — featured card candidate on the listing page
draft: true                              # optional — excluded from the build entirely
---

The first paragraph becomes the large lead paragraph.

## A subheading

Regular paragraphs, with **bold**, *italic* and [links](https://sunnypubs.app).

> A line starting with > becomes a big orange-rule pull quote.

- Bullets become the branded sun-dot list.
- Another bullet.

:::tip
This renders as a "Sunny tip" callout box.
:::
```

## Cities and the filter

The city filter pills on the listing page are generated from the posts —
add a post with a new `city` and it appears automatically. Preferred display
order is set in `CITY_ORDER` in `scripts/build-blog.js`.

## Launching the blog

The blog is currently unlisted: every generated page carries
`<meta name="robots" content="noindex">` and blog URLs are kept out of
`sitemap.xml`. When you're ready to go live, set `NOINDEX = false` at the top
of `scripts/build-blog.js` and rebuild — the noindex tag is dropped and the
blog URLs are added to the sitemap automatically.

The newsletter form has no provider wired up yet; it falls back to opening a
pre-filled email to sunny@sunnypubs.app. Swap in your provider's form action
in `blog/blog.js` / `scripts/build-blog.js` (search for `data-newsletter`).
