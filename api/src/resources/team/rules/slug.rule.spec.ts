import { slugify } from './slug.rule';

describe('slugify', () => {
  it.each([
    { text: 'Bairro Centro', expected: 'bairro-centro' },
    { text: 'São João', expected: 'sao-joao' },
    { text: '  Time   do  Açude!! ', expected: 'time-do-acude' },
    { text: 'Sub-13 A', expected: 'sub-13-a' },
    { text: '---', expected: '' },
  ])('turns "$text" into "$expected"', ({ text, expected }) => {
    expect(slugify(text)).toBe(expected);
  });
});
