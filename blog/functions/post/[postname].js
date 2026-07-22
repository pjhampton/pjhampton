function requestsMarkdown(request) {
  const url = new URL(request.url);
  if (url.searchParams.get('format')?.toLowerCase() === 'markdown') {
    return true;
  }

  const acceptedMediaTypes = (request.headers.get('accept') || '')
    .split(',')
    .map((mediaType) => mediaType.trim());

  return acceptedMediaTypes.some((mediaType) =>
    /^(text\/markdown|text\/x-markdown)(?:\s*;|$)/i.test(mediaType)
  );
}

export async function onRequest(context) {
  const { request } = context;
  if (!['GET', 'HEAD'].includes(request.method) || !requestsMarkdown(request)) {
    return context.next();
  }

  const slug = context.params.postname;
  const assetUrl = new URL(
    `/markdown/${encodeURIComponent(slug)}.md`,
    request.url
  );
  const assetResponse = await context.env.ASSETS.fetch(assetUrl);
  const contentType = assetResponse.headers.get('content-type') || '';

  // The SPA fallback returns index.html for unknown assets, so verify that the
  // asset server actually found a generated Markdown representation.
  if (!assetResponse.ok || !contentType.startsWith('text/markdown')) {
    return new Response('Post not found\n', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  const canonicalUrl = new URL(
    `/post/${encodeURIComponent(slug)}`,
    request.url
  );
  const headers = new Headers(assetResponse.headers);
  headers.set(
    'Cache-Control',
    'public, max-age=0, s-maxage=300, stale-while-revalidate=3600'
  );
  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  headers.set('Content-Disposition', `inline; filename="${slug}.md"`);
  headers.set('Link', `<${canonicalUrl.href}>; rel="canonical"`);
  headers.set('Vary', 'Accept');

  return new Response(request.method === 'HEAD' ? null : assetResponse.body, {
    status: assetResponse.status,
    headers
  });
}
