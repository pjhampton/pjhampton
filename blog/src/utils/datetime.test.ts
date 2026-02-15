import { describe, it, expect } from 'vitest';
import { formatDate } from './datetime';

describe('formatDate', () => {
  it('formats ISO date string correctly', () => {
    expect(formatDate('2024-01-15')).toBe('15 Jan 2024');
  });

  it('handles different months', () => {
    expect(formatDate('2024-06-01')).toBe('1 Jun 2024');
    expect(formatDate('2024-12-25')).toBe('25 Dec 2024');
  });

  it('handles single digit days without padding', () => {
    expect(formatDate('2024-03-05')).toBe('5 Mar 2024');
  });

  it('handles year boundaries', () => {
    expect(formatDate('2023-12-31')).toBe('31 Dec 2023');
    expect(formatDate('2024-01-01')).toBe('1 Jan 2024');
  });

  it('handles ISO date with time component (iOS compatibility)', () => {
    expect(formatDate('2024-01-15T00:00:00.000Z')).toBe('15 Jan 2024');
  });
});
