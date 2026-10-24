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
  date: string;
  time: string;
  location: string;
}

export interface BracketFormState extends FormErrorState {
  values: BracketFormValues;
}

export const BRACKET_ERROR_FIELD = 'teamIds';

export function initialBracketState(seeding: SeededTeam[]): BracketFormState {
  return {
    errorMessage: null,
    errorField: null,
    values: {
      positions: Object.fromEntries(seeding.map((team) => [team.teamId, String(team.seed)])),
      date: '',
      time: '',
      location: '',
    },
  };
}
