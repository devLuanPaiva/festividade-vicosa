const UINT32_RANGE = 4_294_967_296;
const MULBERRY_INCREMENT = 0x6d2b79f5;

export interface Random {
  next(): number;
  int(min: number, max: number): number;
  chance(probability: number): boolean;
  pick<T>(items: readonly T[]): T;
  shuffle<T>(items: readonly T[]): T[];
}

function createGenerator(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + MULBERRY_INCREMENT) >>> 0;
    let mixed = Math.imul(state ^ (state >>> 15), state | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / UINT32_RANGE;
  };
}

export function createRandom(seed: number): Random {
  const next = createGenerator(seed);
  const int = (min: number, max: number): number => min + Math.floor(next() * (max - min + 1));
  const pick = <T>(items: readonly T[]): T => items[int(0, items.length - 1)] as T;
  const shuffle = <T>(items: readonly T[]): T[] => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index--) {
      const other = int(0, index);
      [copy[index], copy[other]] = [copy[other] as T, copy[index] as T];
    }
    return copy;
  };
  return { next, int, pick, shuffle, chance: (probability) => next() < probability };
}
