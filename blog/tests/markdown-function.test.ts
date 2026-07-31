import { describe, expect, it, vi } from 'vitest';

import { onRequest } from '../functions/post/[postname].js';
import { onRequest as onHomepageRequest } from '../functions/index.js';

function createContext({
  accept,
  userAgent,
  method = 'GET',
  url = 'https://pjhampton.com/post/grokking-tmux',
  assetResponse = new Response('# Grokking tmux\n', {
    headers: { 'Content-Type': 'text/markdown' }
  })
}: {
  accept?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  assetResponse?: Response;
}) {
  const next = vi.fn(() => new Response('html'));
  const fetch = vi.fn(() => Promise.resolve(assetResponse));
  const headers = new Headers();
  if (accept) headers.set('Accept', accept);
  if (userAgent) headers.set('User-Agent', userAgent);

  return {
    context: {
      request: new Request(url, {
        method,
        headers
      }),
      params: { postname: 'grokking-tmux' },
      env: { ASSETS: { fetch } },
      next
    },
    fetch,
    next
  };
}

describe('blog post Markdown negotiation', () => {
  it('serves Markdown when requested through the Accept header', async () => {
    const { context, fetch, next } = createContext({
      accept: 'text/markdown, text/html;q=0.9'
    });

    const response = await onRequest(context);

    expect(next).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledOnce();
    expect(response.headers.get('Content-Type')).toBe(
      'text/markdown; charset=utf-8'
    );
    expect(response.headers.get('Vary')).toBe('Accept, User-Agent');
    expect(response.headers.get('Link')).toBe(
      '<https://pjhampton.com/post/grokking-tmux>; rel="canonical"'
    );
    expect(await response.text()).toBe('# Grokking tmux\n');
  });

  it('serves Markdown when requested through the format query parameter', async () => {
    const { context, next } = createContext({
      url: 'https://pjhampton.com/post/grokking-tmux?format=Markdown'
    });

    const response = await onRequest(context);

    expect(next).not.toHaveBeenCalled();
    expect(response.headers.get('Content-Disposition')).toBe(
      'inline; filename="grokking-tmux.md"'
    );
  });

  it('continues to the static HTML page for ordinary browser requests', async () => {
    const { context, fetch, next } = createContext({ accept: 'text/html' });

    const response = await onRequest(context);

    expect(fetch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
    expect(response.headers.get('Vary')).toBe('Accept, User-Agent');
    expect(await response.text()).toBe('html');
  });

  it('honours media type quality values', async () => {
    const { context, fetch, next } = createContext({
      accept: 'text/html, text/markdown;q=0.5'
    });

    const response = await onRequest(context);

    expect(fetch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
    expect(await response.text()).toBe('html');
  });

  it('does not return Markdown when it is explicitly unacceptable', async () => {
    const { context, fetch, next } = createContext({
      accept: 'text/markdown;q=0, */*;q=0.5',
      userAgent: 'Claude-User'
    });

    const response = await onRequest(context);

    expect(fetch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
    expect(await response.text()).toBe('html');
  });

  it('serves Markdown by default to a recognised AI reader', async () => {
    const { context, fetch, next } = createContext({
      accept: '*/*',
      userAgent: 'Mozilla/5.0 (compatible; Claude-User/1.0)'
    });

    const response = await onRequest(context);

    expect(next).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledOnce();
    expect(response.headers.get('Content-Type')).toBe(
      'text/markdown; charset=utf-8'
    );
  });

  it('returns headers without a body for a Markdown HEAD request', async () => {
    const { context } = createContext({
      accept: 'text/markdown',
      method: 'HEAD'
    });

    const response = await onRequest(context);

    expect(response.headers.get('Content-Type')).toBe(
      'text/markdown; charset=utf-8'
    );
    expect(await response.text()).toBe('');
  });

  it('does not treat a model-training crawler as an AI reader', async () => {
    const { context, fetch, next } = createContext({
      accept: '*/*',
      userAgent: 'Mozilla/5.0 (compatible; GPTBot/1.0)'
    });

    const response = await onRequest(context);

    expect(fetch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
    expect(await response.text()).toBe('html');
  });

  it('lets an explicit HTML query override the AI reader default', async () => {
    const { context, fetch, next } = createContext({
      accept: '*/*',
      userAgent: 'Perplexity-User',
      url: 'https://pjhampton.com/post/grokking-tmux?format=html'
    });

    const response = await onRequest(context);

    expect(fetch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
    expect(await response.text()).toBe('html');
  });

  it('returns a plain 404 when no generated Markdown asset exists', async () => {
    const { context } = createContext({
      accept: 'text/markdown',
      assetResponse: new Response('<!doctype html>', {
        headers: { 'Content-Type': 'text/html' }
      })
    });

    const response = await onRequest(context);

    expect(response.status).toBe(404);
    expect(response.headers.get('Vary')).toBe('Accept, User-Agent');
    expect(await response.text()).toBe('Post not found\n');
  });
});

describe('homepage Markdown negotiation', () => {
  it('serves the generated homepage Markdown when requested', async () => {
    const next = vi.fn(() => new Response('html'));
    const fetch = vi.fn(() =>
      Promise.resolve(
        new Response("# Pete Hampton's blog\n", {
          headers: { 'Content-Type': 'text/markdown' }
        })
      )
    );
    const context = {
      request: new Request('https://pjhampton.com/?format=markdown'),
      env: { ASSETS: { fetch } },
      next
    };

    const response = await onHomepageRequest(context);

    expect(next).not.toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledOnce();
    expect(response.headers.get('Content-Type')).toBe(
      'text/markdown; charset=utf-8'
    );
    expect(response.headers.get('Content-Disposition')).toBe(
      'inline; filename="index.md"'
    );
    expect(await response.text()).toBe("# Pete Hampton's blog\n");
  });

  it('continues to the static homepage for ordinary browser requests', async () => {
    const next = vi.fn(() => new Response('html'));
    const context = {
      request: new Request('https://pjhampton.com/', {
        headers: { Accept: 'text/html' }
      }),
      env: { ASSETS: { fetch: vi.fn() } },
      next
    };

    const response = await onHomepageRequest(context);

    expect(next).toHaveBeenCalledOnce();
    expect(response.headers.get('Vary')).toBe('Accept, User-Agent');
    expect(await response.text()).toBe('html');
  });
});
