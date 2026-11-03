import { describe, expect, it } from 'vitest';
import type { MatchListItem, MatchRound } from '../types';
import { buildBracket, type BracketSlot, type BracketTree } from './build-bracket-tree';

function knockout(round: MatchRound, bracketPosition: number | null, id?: string): MatchListItem {
  return {
    id: id ?? `${round}-${bracketPosition}`,
    round,
    bracketPosition,
    scheduledAt: '2026-12-10T12:00:00Z',
  } as MatchListItem;
}

function ids(slots: BracketSlot[]): (string | null)[] {
  return slots.map((slot) => slot?.id ?? null);
}

function columnIds(
  tree: BracketTree | null,
  side: 'sideA' | 'sideB',
  index: number,
): (string | null)[] {
  return ids(tree?.[side][index]?.slots ?? []);
}

function fullRound(round: MatchRound, count: number): MatchListItem[] {
  return Array.from({ length: count }, (_, position) => knockout(round, position));
}

describe('buildBracket', () => {
  it.each([
    ['ROUND_OF_32', 16, [8, 4, 2, 1]],
    ['ROUND_OF_16', 8, [4, 2, 1]],
    ['QUARTER_FINAL', 4, [2, 1]],
    ['SEMI_FINAL', 2, [1]],
    ['FINAL', 1, []],
  ] as [MatchRound, number, number[]][])(
    'shapes the whole tree from a first round of %s',
    (round, count, slotsPerColumn) => {
      const { tree } = buildBracket(fullRound(round, count));

      expect(tree?.sideA.map((column) => column.slots.length)).toEqual(slotsPerColumn);
      expect(tree?.sideB.map((column) => column.slots.length)).toEqual(
        [...slotsPerColumn].reverse(),
      );
    },
  );

  it('puts the first half of the positions on side A and the second half on side B', () => {
    const { tree } = buildBracket(fullRound('QUARTER_FINAL', 4));

    expect(columnIds(tree, 'sideA', 0)).toEqual(['QUARTER_FINAL-0', 'QUARTER_FINAL-1']);
    expect(columnIds(tree, 'sideB', 1)).toEqual(['QUARTER_FINAL-2', 'QUARTER_FINAL-3']);
  });

  it('orders side B columns from the semifinal outwards', () => {
    const { tree } = buildBracket(fullRound('ROUND_OF_16', 8));

    expect(tree?.sideA.map((column) => column.round)).toEqual([
      'ROUND_OF_16',
      'QUARTER_FINAL',
      'SEMI_FINAL',
    ]);
    expect(tree?.sideB.map((column) => column.round)).toEqual([
      'SEMI_FINAL',
      'QUARTER_FINAL',
      'ROUND_OF_16',
    ]);
  });

  it('leaves empty slots for rounds the organization has not confirmed yet', () => {
    const { tree } = buildBracket([...fullRound('QUARTER_FINAL', 4), knockout('SEMI_FINAL', 1)]);

    expect(columnIds(tree, 'sideA', 1)).toEqual([null]);
    expect(columnIds(tree, 'sideB', 0)).toEqual(['SEMI_FINAL-1']);
    expect(tree?.final).toBeNull();
  });

  it('places the final in the center and the third place apart from the tree', () => {
    const { tree, thirdPlace } = buildBracket([
      ...fullRound('SEMI_FINAL', 2),
      knockout('FINAL', 0),
      knockout('THIRD_PLACE', 0),
    ]);

    expect(tree?.final?.id).toBe('FINAL-0');
    expect(thirdPlace?.id).toBe('THIRD_PLACE-0');
  });

  it('keeps matches without bracket position out of the tree', () => {
    const { tree, others } = buildBracket([
      ...fullRound('SEMI_FINAL', 2),
      knockout('SEMI_FINAL', null, 'manual'),
    ]);

    expect(columnIds(tree, 'sideA', 0)).toEqual(['SEMI_FINAL-0']);
    expect(others.map((match) => match.id)).toEqual(['manual']);
  });

  it('sends matches outside the tree shape to the other matches', () => {
    const { others } = buildBracket([
      ...fullRound('SEMI_FINAL', 2),
      knockout('SEMI_FINAL', 5, 'out-of-range'),
      knockout('FINAL', 3, 'wrong-final'),
    ]);

    expect(others.map((match) => match.id)).toEqual(['out-of-range', 'wrong-final']);
  });

  it('shows only manual matches when no match has a bracket position', () => {
    const { tree, others } = buildBracket([knockout('QUARTER_FINAL', null, 'manual')]);

    expect(tree).toBeNull();
    expect(others.map((match) => match.id)).toEqual(['manual']);
  });

  it('returns nothing when there is no knockout match', () => {
    expect(buildBracket([])).toEqual({ tree: null, thirdPlace: null, others: [] });
  });
});
