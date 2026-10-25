import { MatchStatus, type MatchRound } from '../enums/match.enums';
import {
  loserDestination,
  siblingPosition,
  winnerDestination,
  type BracketDestination,
} from './bracket.rule';

export interface BracketMatchShape {
  id: string;
  round: MatchRound | null;
  bracketPosition: number | null;
  status: MatchStatus;
  scheduledAt: Date;
  teamAId: string;
  teamBId: string;
  winnerId: string | null;
}

export interface NextMatchSuggestion {
  round: MatchRound;
  bracketPosition: number;
  teamAId: string;
  teamBId: string;
  scheduledAt: Date;
  matchId: string | null;
}

type Outcome = 'WINNER' | 'LOSER';

interface PlacedMatch extends BracketMatchShape {
  round: MatchRound;
  bracketPosition: number;
  winnerId: string;
}

interface Pairing {
  destination: BracketDestination;
  teamAId: string;
  teamBId: string;
  scheduledAt: Date;
}

const OUTCOMES: Outcome[] = ['WINNER', 'LOSER'];

function isDecided(match: BracketMatchShape): match is PlacedMatch {
  return (
    match.status === MatchStatus.FINALIZED &&
    match.round !== null &&
    match.bracketPosition !== null &&
    match.winnerId !== null
  );
}

function destinationOf(match: PlacedMatch, outcome: Outcome): BracketDestination | null {
  return outcome === 'WINNER'
    ? winnerDestination(match.round, match.bracketPosition)
    : loserDestination(match.round, match.bracketPosition);
}

function teamOf(match: PlacedMatch, outcome: Outcome): string {
  if (outcome === 'WINNER') {
    return match.winnerId;
  }
  return match.winnerId === match.teamAId ? match.teamBId : match.teamAId;
}

function laterOf(first: Date, second: Date): Date {
  return first > second ? first : second;
}

function findSibling(match: PlacedMatch, decided: PlacedMatch[]): PlacedMatch | undefined {
  const position = siblingPosition(match.bracketPosition);
  return decided.find((other) => other.round === match.round && other.bracketPosition === position);
}

function pairOf(first: PlacedMatch, second: PlacedMatch, outcome: Outcome): Pairing | null {
  const destination = destinationOf(first, outcome);
  if (!destination) {
    return null;
  }
  const isFirstTeamA = destination.slot === 'teamAId';
  const [teamAId, teamBId] = isFirstTeamA
    ? [teamOf(first, outcome), teamOf(second, outcome)]
    : [teamOf(second, outcome), teamOf(first, outcome)];
  return {
    destination,
    teamAId,
    teamBId,
    scheduledAt: laterOf(first.scheduledAt, second.scheduledAt),
  };
}

function pairingsOf(decided: PlacedMatch[]): Pairing[] {
  return decided
    .filter((match) => match.bracketPosition % 2 === 0)
    .flatMap((match) => {
      const sibling = findSibling(match, decided);
      return sibling ? OUTCOMES.map((outcome) => pairOf(match, sibling, outcome)) : [];
    })
    .filter((pairing): pairing is Pairing => pairing !== null);
}

function findExisting(
  matches: BracketMatchShape[],
  destination: BracketDestination,
): BracketMatchShape | undefined {
  return matches.find(
    (match) =>
      match.round === destination.round && match.bracketPosition === destination.bracketPosition,
  );
}

function toSuggestion(
  pairing: Pairing,
  existing: BracketMatchShape | undefined,
): NextMatchSuggestion | null {
  const { destination, teamAId, teamBId, scheduledAt } = pairing;
  const { round, bracketPosition } = destination;
  const base = { round, bracketPosition, teamAId, teamBId };
  if (!existing) {
    return { ...base, scheduledAt, matchId: null };
  }
  const isUpToDate = existing.teamAId === teamAId && existing.teamBId === teamBId;
  return isUpToDate || existing.status === MatchStatus.FINALIZED
    ? null
    : { ...base, scheduledAt: existing.scheduledAt, matchId: existing.id };
}

export function suggestNextMatches(matches: BracketMatchShape[]): NextMatchSuggestion[] {
  return pairingsOf(matches.filter(isDecided))
    .map((pairing) => toSuggestion(pairing, findExisting(matches, pairing.destination)))
    .filter((suggestion): suggestion is NextMatchSuggestion => suggestion !== null);
}
