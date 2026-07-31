import {
  mergeVary,
  preferredRepresentation
} from '../../scripts/markdown-request.js';

function representationFor(request) {
  return preferredRepresentation({
    url: request.url,
    accept: request.headers.get('accept'),
    userAgent: request.headers.get('user-agent')
  });
}

function withRepresentationVary(response) {
  const headers = new Headers(response.headers);
  headers.set('Vary', mergeVary(headers.get('Vary')));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export async function onRequest(context) {
  const { request } = context;
  if (!['GET', 'HEAD'].includes(request.method)) {
    return context.next();
  }
  if (representationFor(request) !== 'markdown') {
    return withRepresentationVary(await context.next());
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
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        Vary: mergeVary()
      }
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
  headers.set('Vary', mergeVary(headers.get('Vary')));

  return new Response(request.method === 'HEAD' ? null : assetResponse.body, {
    status: assetResponse.status,
    headers
  });
}
