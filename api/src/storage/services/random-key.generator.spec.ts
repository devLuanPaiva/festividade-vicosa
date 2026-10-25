import { RandomKeyGenerator } from './random-key.generator';

describe('RandomKeyGenerator', () => {
  it('makes a 24 character hexadecimal key that is different every time', () => {
    const generator = new RandomKeyGenerator();
    const keys = Array.from({ length: 50 }, () => generator.next());

    expect(keys.every((key) => /^[0-9a-f]{24}$/.test(key))).toBe(true);
    expect(new Set(keys).size).toBe(50);
  });
});
