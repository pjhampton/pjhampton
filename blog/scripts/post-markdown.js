export const siteUrl = 'https://pjhampton.com';

function inline(value) {
  return String(value)
    .replace(/\s+/g, ' ')
    .replace(/([\\`*_[\]<>])/g, '\\$1')
    .trim();
}

function link(label, url) {
  const safeUrl = String(url).replace(/[<>\r\n]/g, '');
  return `[${inline(label)}](<${safeUrl}>)`;
}

function calendarDate(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function renderPostMarkdown(slug, frontMatter, markdownBody) {
  const canonicalUrl = `${siteUrl}/post/${slug}`;
  const author = frontMatter.author_link
    ? link(frontMatter.author, frontMatter.author_link)
    : inline(frontMatter.author);
  const published = calendarDate(frontMatter.date);

  return [
    `# ${inline(frontMatter.title)}`,
    '',
    `Source: ${link(canonicalUrl, canonicalUrl)}`,
    '',
    `Author: ${author}`,
    '',
    `Published: ${published}`,
    '',
    markdownBody.trim(),
    ''
  ].join('\n');
}

export function renderHomepageMarkdown(posts) {
  const sortedPosts = [...posts].sort(
    (a, b) => Date.parse(b.frontMatter.date) - Date.parse(a.frontMatter.date)
  );
  const lines = [
    "# Pete Hampton's blog",
    '',
    `Source: ${link(siteUrl, siteUrl)}`,
    '',
    'Pete Hampton · Code Zookeeper',
    '',
    `${link('GitHub', 'https://github.com/pjhampton')} · ${link('X', 'https://x.com/_pjhampton')} · ${link('Speaker Deck', 'https://speakerdeck.com/pjhampton')}`,
    '',
    '## Posts',
    ''
  ];
  let currentYear;

  for (const post of sortedPosts) {
    const published = calendarDate(post.frontMatter.date);
    const year = published.slice(0, 4);
    if (year !== currentYear) {
      if (currentYear) lines.push('');
      lines.push(`### ${year}`, '');
      currentYear = year;
    }
    lines.push(
      `- ${published} — ${link(post.frontMatter.title, `${siteUrl}/post/${post.slug}`)}`
    );
  }

  lines.push('');
  return lines.join('\n');
}
