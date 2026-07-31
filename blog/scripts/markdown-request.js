export const representationVary = ['Accept', 'User-Agent'];

export const aiReaderUserAgents = [
  'ChatGPT-User',
  'OAI-SearchBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User'
];

function parseQuality(parameter) {
  const match = parameter.match(/^q\s*=\s*(.+)$/i);
  if (!match) return undefined;

  const quality = Number(match[1]);
  if (!Number.isFinite(quality) || quality < 0 || quality > 1) return 0;
  return quality;
}

function parseAccept(accept) {
  return String(accept || '')
    .split(',')
    .map((entry) => {
      const [mediaRange, ...parameters] = entry
        .split(';')
        .map((part) => part.trim());
      const [type, subtype] = mediaRange.toLowerCase().split('/');
      if (!type || !subtype) return undefined;

      let quality = 1;
      for (const parameter of parameters) {
        const parsedQuality = parseQuality(parameter);
        if (parsedQuality !== undefined) {
          quality = parsedQuality;
          break;
        }
      }

      return { type, subtype, quality };
    })
    .filter(Boolean);
}

function qualityFor(mediaType, acceptedRanges) {
  const [type, subtype] = mediaType.split('/');
  let bestSpecificity = -1;
  let bestQuality = 0;

  for (const range of acceptedRanges) {
    const typeMatches = range.type === '*' || range.type === type;
    const subtypeMatches = range.subtype === '*' || range.subtype === subtype;
    if (!typeMatches || !subtypeMatches) continue;

    const specificity = range.type === '*' ? 0 : range.subtype === '*' ? 1 : 2;
    if (
      specificity > bestSpecificity ||
      (specificity === bestSpecificity && range.quality > bestQuality)
    ) {
      bestSpecificity = specificity;
      bestQuality = range.quality;
    }
  }

  return bestQuality;
}

function exactQualityFor(mediaType, acceptedRanges) {
  const [type, subtype] = mediaType.split('/');
  return acceptedRanges
    .filter((range) => range.type === type && range.subtype === subtype)
    .reduce((quality, range) => Math.max(quality, range.quality), 0);
}

function acceptPreference(accept) {
  const acceptedRanges = parseAccept(accept);
  if (acceptedRanges.length === 0) return undefined;

  const markdownQuality = Math.max(
    qualityFor('text/markdown', acceptedRanges),
    exactQualityFor('text/x-markdown', acceptedRanges)
  );
  const htmlQuality = qualityFor('text/html', acceptedRanges);

  if (markdownQuality > htmlQuality) return 'markdown';
  if (htmlQuality > markdownQuality) return 'html';

  // Equal positive values, including */*, do not express a useful preference.
  // Equal zero values explicitly rule Markdown out, so preserve the HTML path.
  return markdownQuality === 0 ? 'html' : undefined;
}

export function isAiReader(userAgent) {
  const value = String(userAgent || '').toLowerCase();
  return aiReaderUserAgents.some((agent) =>
    value.includes(agent.toLowerCase())
  );
}

export function preferredRepresentation({ url, accept, userAgent }) {
  const format = new URL(url, 'http://localhost').searchParams
    .get('format')
    ?.toLowerCase();

  if (format === 'markdown' || format === 'html') return format;

  const accepted = acceptPreference(accept);
  if (accepted) return accepted;

  return isAiReader(userAgent) ? 'markdown' : 'html';
}

export function mergeVary(current, values = representationVary) {
  const existing = String(current || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (existing.includes('*')) return '*';

  const seen = new Set(existing.map((value) => value.toLowerCase()));
  for (const value of values) {
    if (!seen.has(value.toLowerCase())) {
      existing.push(value);
      seen.add(value.toLowerCase());
    }
  }

  return existing.join(', ');
}
