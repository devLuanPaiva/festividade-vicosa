import type { SuggestionRow } from '@/features/admin-suggestions/types';
import type { FormErrorState } from '@/lib/forms/form-errors';

export interface SeededTeam {
  seed: number;
  teamId: string;
  teamName: string;
  groupId: string;
  groupName: string;
  qualifiedPosition: number;
}

export interface BracketFormValues {
  positions: Record<string, string>;
}

export interface BracketFormState extends FormErrorState {
  values: BracketFormValues;
  rows: SuggestionRow[] | null;
}

export const BRACKET_ERROR_FIELD = 'teamIds';

export function initialBracketState(seeding: SeededTeam[]): BracketFormState {
  return {
    errorMessage: null,
    errorField: null,
    rows: null,
    values: {
      positions: Object.fromEntries(seeding.map((team) => [team.teamId, String(team.seed)])),
    },
  };
}
