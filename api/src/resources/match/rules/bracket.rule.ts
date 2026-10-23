import { MatchRound } from '../enums/match.enums';
import { problem, type RuleProblem } from './rule-problem';

export type BracketSlot = 'teamAId' | 'teamBId';

export interface BracketPairing {
  bracketPosition: number;
  teamAId: string;
  teamBId: string;
}

export interface BracketDestination {
  round: MatchRound;
  bracketPosition: number;
  slot: BracketSlot;
}

const FIRST_ROUND_BY_TEAM_COUNT: Record<number, MatchRound> = {
  2: MatchRound.FINAL,
  4: MatchRound.SEMI_FINAL,
  8: MatchRound.QUARTER_FINAL,
  16: MatchRound.ROUND_OF_16,
};

const WINNER_ROUND: Partial<Record<MatchRound, MatchRound>> = {
  [MatchRound.ROUND_OF_16]: MatchRound.QUARTER_FINAL,
  [MatchRound.QUARTER_FINAL]: MatchRound.SEMI_FINAL,
  [MatchRound.SEMI_FINAL]: MatchRound.FINAL,
};

const LOSER_ROUND: Partial<Record<MatchRound, MatchRound>> = {
  [MatchRound.SEMI_FINAL]: MatchRound.THIRD_PLACE,
};

export const SUPPORTED_TEAM_COUNTS = Object.keys(FIRST_ROUND_BY_TEAM_COUNT).map(Number);

export function findBracketTeamsProblem(teamIds: string[]): RuleProblem | null {
  if (!(teamIds.length in FIRST_ROUND_BY_TEAM_COUNT)) {
    return problem(
      'BRACKET_SIZE_INVALID',
      `O chaveamento precisa de ${SUPPORTED_TEAM_COUNTS.join(', ')} times.`,
      'teamIds',
    );
  }
  return new Set(teamIds).size === teamIds.length
    ? null
    : problem('BRACKET_TEAMS_DUPLICATED', 'Não repita times no chaveamento.', 'teamIds');
}

export function firstRoundFor(teamCount: number): MatchRound {
  return FIRST_ROUND_BY_TEAM_COUNT[teamCount] ?? MatchRound.FINAL;
}

function seedOrder(teamCount: number): number[] {
  let order = [1];
  while (order.length < teamCount) {
    const size = order.length * 2;
    order = order.flatMap((seed) => [seed, size + 1 - seed]);
  }
  return order;
}

export function pairFirstRound(teamIds: string[]): BracketPairing[] {
  const seeded = seedOrder(teamIds.length).flatMap((seed) => teamIds.slice(seed - 1, seed));
  const pairs = Array.from({ length: seeded.length / 2 }, (_, index) =>
    seeded.slice(index * 2, index * 2 + 2),
  );
  return pairs.flatMap(([teamAId, teamBId], bracketPosition) =>
    teamAId && teamBId ? [{ bracketPosition, teamAId, teamBId }] : [],
  );
}

function destinationIn(
  round: MatchRound | undefined,
  bracketPosition: number,
): BracketDestination | null {
  if (!round) {
    return null;
  }
  return {
    round,
    bracketPosition: Math.floor(bracketPosition / 2),
    slot: bracketPosition % 2 === 0 ? 'teamAId' : 'teamBId',
  };
}

export function winnerDestination(
  round: MatchRound,
  bracketPosition: number,
): BracketDestination | null {
  return destinationIn(WINNER_ROUND[round], bracketPosition);
}

export function loserDestination(
  round: MatchRound,
  bracketPosition: number,
): BracketDestination | null {
  return destinationIn(LOSER_ROUND[round], bracketPosition);
}

export function siblingPosition(bracketPosition: number): number {
  return bracketPosition % 2 === 0 ? bracketPosition + 1 : bracketPosition - 1;
}
