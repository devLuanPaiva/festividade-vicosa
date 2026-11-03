import type { MatchListItem, MatchRound } from '../types';
import { roundLabel } from './match-labels';

export type BracketSlot = MatchListItem | null;

export interface BracketColumn {
  round: MatchRound;
  title: string;
  slots: BracketSlot[];
}

export interface BracketTree {
  sideA: BracketColumn[];
  final: BracketSlot;
  sideB: BracketColumn[];
}

export interface BuiltBracket {
  tree: BracketTree | null;
  thirdPlace: BracketSlot;
  others: MatchListItem[];
}

const TREE_ROUNDS: MatchRound[] = [
  'ROUND_OF_32',
  'ROUND_OF_16',
  'QUARTER_FINAL',
  'SEMI_FINAL',
  'FINAL',
];

function slotKey(round: MatchRound, bracketPosition: number): string {
  return `${round}:${bracketPosition}`;
}

function isPositioned(match: MatchListItem): boolean {
  return match.round !== null && match.round !== 'THIRD_PLACE' && match.bracketPosition !== null;
}

function findFirstRound(matches: MatchListItem[]): MatchRound | undefined {
  return TREE_ROUNDS.find((round) => matches.some((match) => match.round === round));
}

function slotCountOf(rounds: MatchRound[], roundIndex: number): number {
  return 2 ** (rounds.length - 1 - roundIndex);
}

type PositionedMatch = MatchListItem & { round: MatchRound; bracketPosition: number };

function fitsSlot(match: MatchListItem, rounds: MatchRound[]): match is PositionedMatch {
  const roundIndex = rounds.findIndex((round) => round === match.round);
  return (
    roundIndex >= 0 &&
    match.bracketPosition !== null &&
    match.bracketPosition >= 0 &&
    match.bracketPosition < slotCountOf(rounds, roundIndex)
  );
}

function indexSlots(matches: MatchListItem[], rounds: MatchRound[]): Map<string, MatchListItem> {
  const slots = new Map<string, MatchListItem>();
  matches
    .filter((match): match is PositionedMatch => fitsSlot(match, rounds))
    .forEach((match) => {
      const key = slotKey(match.round, match.bracketPosition);
      if (!slots.has(key)) {
        slots.set(key, match);
      }
    });
  return slots;
}

function buildHalf(
  rounds: MatchRound[],
  slots: Map<string, MatchListItem>,
  half: 'A' | 'B',
): BracketColumn[] {
  return rounds.slice(0, -1).map((round, roundIndex) => {
    const halfCount = slotCountOf(rounds, roundIndex) / 2;
    const offset = half === 'A' ? 0 : halfCount;
    return {
      round,
      title: roundLabel(round),
      slots: Array.from(
        { length: halfCount },
        (_, index) => slots.get(slotKey(round, offset + index)) ?? null,
      ),
    };
  });
}

function buildTree(matches: MatchListItem[], rounds: MatchRound[]): BracketTree {
  const slots = indexSlots(matches, rounds);
  return {
    sideA: buildHalf(rounds, slots, 'A'),
    final: slots.get(slotKey('FINAL', 0)) ?? null,
    sideB: buildHalf(rounds, slots, 'B').reverse(),
  };
}

function byScheduledAt(first: MatchListItem, second: MatchListItem): number {
  return first.scheduledAt.localeCompare(second.scheduledAt);
}

export function buildBracket(matches: MatchListItem[]): BuiltBracket {
  const knockout = matches.filter((match) => match.round !== null).sort(byScheduledAt);
  const firstRound = findFirstRound(knockout.filter(isPositioned));
  const rounds = firstRound ? TREE_ROUNDS.slice(TREE_ROUNDS.indexOf(firstRound)) : [];
  const placed = new Set(firstRound ? indexSlots(knockout, rounds).values() : []);
  const thirdPlace = knockout.find((match) => match.round === 'THIRD_PLACE') ?? null;
  return {
    tree: firstRound ? buildTree(knockout, rounds) : null,
    thirdPlace,
    others: knockout.filter((match) => !placed.has(match) && match !== thirdPlace),
  };
}
