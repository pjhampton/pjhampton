import { describe, expect, it } from 'vitest';

import {
  aiReaderUserAgents,
  isAiReader,
  mergeVary,
  preferredRepresentation
} from '../scripts/markdown-request.js';

describe('Markdown representation preferences', () => {
  it.each(aiReaderUserAgents)(
    'recognises the %s search or retrieval user agent',
    (userAgent) => {
      expect(isAiReader(`Mozilla/5.0 (compatible; ${userAgent}/1.0)`)).toBe(
        true
      );
    }
  );

  it('prefers Markdown when its quality value is higher', () => {
    expect(
      preferredRepresentation({
        url: 'https://pjhampton.com/post/grokking-tmux',
        accept: 'text/html;q=0.5, text/markdown',
        userAgent: ''
      })
    ).toBe('markdown');
  });

  it('uses a broad Accept header as a bot-default fallback', () => {
    expect(
      preferredRepresentation({
        url: 'https://pjhampton.com/post/grokking-tmux',
        accept: '*/*',
        userAgent: 'OAI-SearchBot'
      })
    ).toBe('markdown');
  });

  it('merges representation headers with an existing Vary value', () => {
    expect(mergeVary('Origin, accept')).toBe('Origin, accept, User-Agent');
  });
});
