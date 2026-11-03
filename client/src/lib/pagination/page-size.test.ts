import { describe, expect, it } from 'vitest';
import { parsePageNumber, parsePageSize } from './page-size';

describe('parsePageSize', () => {
  it('accepts only the sizes the list offers', () => {
    expect(parsePageSize('50')).toBe(50);
    expect(parsePageSize('7')).toBe(25);
    expect(parsePageSize('99999')).toBe(25);
    expect(parsePageSize('abc')).toBe(25);
  });
});

describe('parsePageNumber', () => {
  it('falls back to the first page for anything that is not a positive integer', () => {
    expect(parsePageNumber('4')).toBe(4);
    expect(parsePageNumber('0')).toBe(1);
    expect(parsePageNumber('-2')).toBe(1);
    expect(parsePageNumber('x')).toBe(1);
  });
});
