import { describe, expect, it } from 'vitest';
import type { RecentResult } from '../types';
import { describeScore } from './result-line';

function resultOf(overrides: Partial<RecentResult>): RecentResult {
  return { scoreA: 3, scoreB: 1, resultType: 'PLAYED', ...overrides } as RecentResult;
}

describe('describeScore', () => {
  it('shows the score of a played match', () => {
    expect(describeScore(resultOf({}))).toBe('3 x 1');
  });

  it('shows a goalless draw as a score, not as a missing result', () => {
    expect(describeScore(resultOf({ scoreA: 0, scoreB: 0 }))).toBe('0 x 0');
  });

  it.each([
    ['WALKOVER', 'W.O.'],
    ['DOUBLE_WALKOVER', 'W.O. dos dois'],
  ] as const)('shows %s without the null score', (resultType, expected) => {
    expect(describeScore(resultOf({ resultType, scoreA: null, scoreB: null }))).toBe(expected);
  });
});
