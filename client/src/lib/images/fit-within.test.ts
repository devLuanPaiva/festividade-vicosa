import { describe, expect, it } from 'vitest';
import { fitWithin, type ImageSize } from './fit-within';

interface Case {
  name: string;
  input: ImageSize;
  expected: ImageSize;
}

const CASES: Case[] = [
  {
    name: 'shrinks a landscape photo by its width',
    input: { width: 4000, height: 3000 },
    expected: { width: 2000, height: 1500 },
  },
  {
    name: 'shrinks a portrait photo by its height',
    input: { width: 3000, height: 4000 },
    expected: { width: 1500, height: 2000 },
  },
  {
    name: 'never enlarges a small photo',
    input: { width: 800, height: 600 },
    expected: { width: 800, height: 600 },
  },
  {
    name: 'keeps a photo that is exactly at the limit',
    input: { width: 2000, height: 1000 },
    expected: { width: 2000, height: 1000 },
  },
  {
    name: 'keeps at least one pixel on the short side',
    input: { width: 20000, height: 2 },
    expected: { width: 2000, height: 1 },
  },
];

describe('fitWithin', () => {
  it.each(CASES)('$name', ({ input, expected }) => {
    expect(fitWithin(input, 2000)).toEqual(expected);
  });
});
