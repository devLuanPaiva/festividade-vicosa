import type { SelectOption } from '@/components/ui/SelectField';
import type { MatchRound } from '@/features/games/types';
import type { FormErrorState } from '@/lib/forms/form-errors';

export interface FixtureSuggestion {
  round: number;
  teamAId: string;
  teamBId: string;
}

export interface BracketMatchSuggestion {
  round: MatchRound;
  bracketPosition: number;
  teamAId: string;
  teamBId: string;
  scheduledAt: string | null;
  matchId: string | null;
}

export interface SuggestionRow {
  stage: 'GROUP' | 'KNOCKOUT';
  groupId: string;
  round: string;
  bracketPosition: string;
  matchId: string;
  title: string;
  note: string;
  teamAId: string;
  teamBId: string;
  date: string;
  time: string;
  location: string;
  isIncluded: boolean;
}

export interface SuggestionDefaults {
  date: string;
  time: string;
  location: string;
}

export interface SuggestionFormValues {
  rows: SuggestionRow[];
  defaults: SuggestionDefaults;
}

export interface SuggestionFormState extends FormErrorState {
  values: SuggestionFormValues;
}

export interface SuggestionTarget {
  categoryId: string;
  returnPath: string;
}

export interface SuggestionReviewProps {
  target: SuggestionTarget;
  rows: SuggestionRow[];
  teamOptions: SelectOption[];
  submitLabel: string;
}

export const EMPTY_SUGGESTION_DEFAULTS: SuggestionDefaults = { date: '', time: '', location: '' };

export const ROWS_ERROR_FIELD = 'rows';

export function initialSuggestionState(rows: SuggestionRow[]): SuggestionFormState {
  return {
    errorMessage: null,
    errorField: null,
    values: { rows, defaults: EMPTY_SUGGESTION_DEFAULTS },
  };
}
