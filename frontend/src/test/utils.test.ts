import { describe, it, expect } from 'vitest';
import { formatDuration, formatDate, getDayName, cn, generateId } from '../lib/utils';

describe('formatDuration', () => {
  it('formats minutes only', () => {
    expect(formatDuration(25)).toBe('25m');
  });

  it('formats hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });

  it('formats zero minutes', () => {
    expect(formatDuration(0)).toBe('0m');
  });
});

describe('getDayName', () => {
  it('returns Sunday for 0', () => {
    expect(getDayName(0)).toBe('Sunday');
  });

  it('returns Saturday for 6', () => {
    expect(getDayName(6)).toBe('Saturday');
  });
});

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('filters falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });
});

describe('generateId', () => {
  it('returns a valid UUID', () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});
