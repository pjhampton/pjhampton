---
title: 'First class markdown'
author: 'Pete Hampton'
author_link: 'https://github.com/pjhampton'
date: '2026-Jul-31'
show_post_footer: true
excerpt: >
  I made this blog serve HTML to browsers and Markdown to agents without maintaining two versions of every post.
---

Most posts on this blog are Markdown wrapped in HTML. That is exactly what I want for somebody reading in a browser, but it is a slightly roundabout journey for an agent that only wants the words. I wondered how difficult it would be to let both use the same URL and get the representation that suits them. 

The short answer to the title is: sometimes. A public, text-heavy website that already starts life as Markdown is a very good fit. An interactive application, where state, layout or personalised data carries the meaning, probably is not. Markdown should be another interface to the content, not a ritual applied to every website because agents are the current hot thing, but it was something I wanted to experiment.

You can try it by adding `?format=markdown` to a post:

```text
https://pjhampton.com/post/finding-the-right-words?format=markdown
```

Or, if you prefer to ask with `curl`:

```bash
$ curl -H 'Accept: text/markdown' \
    https://pjhampton.com/post/finding-the-right-words
```

An ordinary browser request still gets the normal HTML page. A caller can also force HTML with `?format=html`. The URL identifies the post; the request decides which representation should be returned.

## One URL, two representations

The web is read by software as well as people. Search engines have done this for years, but agents, language models, command-line tools and small scripts are now trying to understand the same pages. HTML is a fine delivery format for a browser, but it brings navigation, styling, scripts and other unrelated information along with the words. A Markdown response is smaller, predictable and much closer to the thing I originally wrote. This is not about replacing the blog. People should still get typography, syntax highlighting, navigation and all the other details that make reading pleasant. It is about giving machines a useful representation without asking them to reverse-engineer the presentation first.

There is also something pleasingly ordinary about this. A web resource does not have to mean one file format. The same post can be represented as HTML or Markdown while keeping one canonical URL.

## Generate it once

The posts on this site already live as Markdown files with some front matter:

```markdown
---
title: 'Finding the right words'
author: 'Pete Hampton'
date: '2021-Jul-17'
---

This is _Take 3_ of starting a blog...
```

During the production build I read each file with `gray-matter`, separate the metadata from the body, and write a public Markdown representation to `dist/markdown`.

```js
const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
const { data, content } = matter(raw);
const markdown = renderPostMarkdown(slug, data, content);

fs.writeFileSync(path.join(markdownDir, `${slug}.md`), markdown);
```

The rendered version adds the title, source URL, author and publication date before the original body. I also generate a Markdown homepage containing the posts grouped by year. No database or runtime Markdown renderer is required. They are ordinary static assets made during the same build as the website.

This matters because there should only be one source of truth. Maintaining a second, hand-written version for machines would eventually drift away from the page people see.

## Negotiate at the edge

The site runs on Cloudflare Pages. A small Pages Function looks at the request before serving the static site. The decision happens in this order:

1. An explicit `?format=markdown` or `?format=html` wins.
2. The `Accept` header is compared, including its quality values.
3. If the header expresses no useful preference, a recognised AI reader gets Markdown.
4. Everybody else gets HTML.

```js
const representation = preferredRepresentation({
  url: request.url,
  accept: request.headers.get('accept'),
  userAgent: request.headers.get('user-agent')
});
```

This is a small detail worth getting right. `Accept: text/html, text/markdown;q=0.5` prefers HTML, while `text/markdown;q=0` says Markdown is unacceptable. My first pass only looked for the string `text/markdown`, which ignored both cases. It was an opt-in check wearing a content-negotiation hat.

If HTML wins, the function calls `context.next()` and the site carries on as before. If Markdown wins, it fetches the generated asset for the homepage or post and returns it with:

```http
Content-Type: text/markdown; charset=utf-8
Content-Disposition: inline; filename="finding-the-right-words.md"
Vary: Accept, User-Agent
Link: <https://pjhampton.com/post/finding-the-right-words>; rel="canonical"
```

`Vary` is added to both the HTML and Markdown responses. Adding it only to the Markdown branch would leave a shared cache free to reuse an HTML response for a Markdown request. The query parameter is already part of the URL, while `Accept` and `User-Agent` need to be declared.

Varying on the complete `User-Agent` value can fragment a cache. That is an acceptable trade-off for this small blog, but I would not copy it blindly onto a busy site. I would normalise the bot check into a small cache-key category or require an explicit Markdown URL instead. `GET` and `HEAD` are supported here, while every other method passes through untouched.

## Not all AI bots are the same

The query parameter and `Accept` header are good signals, but they put the responsibility on the caller. If an AI agent sends a broad `Accept: */*` header, I make Markdown the default for a small list of recognised search and user-directed retrieval agents:

```js
[
  'ChatGPT-User',
  'OAI-SearchBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User'
]
```

The purpose of the bot matters more to me than the company operating it. OpenAI distinguishes its [search crawler from its training crawler](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq), Anthropic documents separate [training, search and user-directed agents](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), and Perplexity separates [search indexing from user-requested retrieval](https://docs.perplexity.ai/docs/resources/perplexity-crawlers). My `robots.txt` allows the search and retrieval group but continues to block model-training crawlers such as `GPTBot` and `ClaudeBot`.

Serving a format and granting permission to crawl are different decisions. `robots.txt` expresses the policy; content negotiation only decides the shape of an allowed response. User-agent matching is also not authentication. Names change and any client can pretend to be something else, so this is a convenience rather than a security boundary.

## Keep development boring

Features that only work after deployment are irritating to build. A small Vite middleware shares the same rendering and request-preference code with the production function. The query parameter, `Accept` header and bot fallback therefore behave the same way in development and preview.

There was one less obvious trap. This is a single-page application, so a missing static asset may fall back to `index.html` with a successful response. Checking the status alone is not enough. The function also verifies that the generated asset has a `text/markdown` content type before returning it. Otherwise, an unknown post could claim to be Markdown while quietly serving the application shell. This is the sort of annoying edge case that becomes obvious only after you find it.

I added tests around these boundaries: quality values, explicit overrides, ordinary HTML requests, recognised readers, blocked training bots, missing posts, the homepage and the response headers. Most of the implementation is simple. The tests are there to make sure it stays simple.

## Should you do it?

I would consider it when the content is public, mostly text and already has a clean source representation. Blogs, documentation and reference pages are obvious candidates. The cost is low and automated readers avoid scraping meaning back out of the presentation. If I noticed more and more requesters such as firecrawl or tavily, I might consider this more of a permanent feature rather than an experimental side quest. 

What I will conclude however, is I would be more cautious when the website is an interactive application, the response is personalised, or an API already expresses the underlying data better. HTML also carries useful semantics, links and structured data. Markdown is not automatically the best agent interface simply because it contains fewer characters.

For this incredibly simple blog, the answer is yes. The source was already there, so the feature amounted to some generated files, a small decision at the edge and tests around the awkward bits. People still get the website I designed for them. Agents can get the words without the noise.
