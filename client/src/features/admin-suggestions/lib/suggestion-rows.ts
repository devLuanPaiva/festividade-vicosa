import { toDateInput, toTimeInput } from '@/features/admin-matches/lib/match-schedule';
import { roundLabel } from '@/features/games/lib/match-labels';
import type { MatchRound } from '@/features/games/types';
import type { BracketMatchSuggestion, FixtureSuggestion, SuggestionRow } from '../types';

const SINGLE_MATCH_ROUNDS: MatchRound[] = ['FINAL', 'THIRD_PLACE'];

const UPDATE_NOTE =
  'Já existe uma partida nesta posição com outros times. Confirmar atualiza os times dela.';

function blankRow(): SuggestionRow {
  return {
    stage: 'GROUP',
    groupId: '',
    round: '',
    bracketPosition: '',
    matchId: '',
    title: '',
    note: '',
    teamAId: '',
    teamBId: '',
    date: '',
    time: '',
    location: '',
    isIncluded: true,
  };
}

export function toGroupFixtureRows(
  suggestions: FixtureSuggestion[],
  groupId: string,
): SuggestionRow[] {
  return suggestions.map((suggestion) => ({
    ...blankRow(),
    groupId,
    title: `Rodada ${suggestion.round}`,
    teamAId: suggestion.teamAId,
    teamBId: suggestion.teamBId,
  }));
}

export function bracketMatchTitle(round: MatchRound, bracketPosition: number): string {
  return SINGLE_MATCH_ROUNDS.includes(round)
    ? roundLabel(round)
    : `${roundLabel(round)} · jogo ${bracketPosition + 1}`;
}

export function toBracketRows(suggestions: BracketMatchSuggestion[]): SuggestionRow[] {
  return suggestions.map((suggestion) => ({
    ...blankRow(),
    stage: 'KNOCKOUT',
    round: suggestion.round,
    bracketPosition: String(suggestion.bracketPosition),
    matchId: suggestion.matchId ?? '',
    title: bracketMatchTitle(suggestion.round, suggestion.bracketPosition),
    note: suggestion.matchId ? UPDATE_NOTE : '',
    teamAId: suggestion.teamAId,
    teamBId: suggestion.teamBId,
    date: suggestion.scheduledAt ? toDateInput(suggestion.scheduledAt) : '',
    time: suggestion.scheduledAt ? toTimeInput(suggestion.scheduledAt) : '',
  }));
}
