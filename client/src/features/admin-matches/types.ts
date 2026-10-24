import type { MatchRound, MatchStage } from '@/features/games/types';
import type { FormErrorState } from '@/lib/forms/form-errors';

export interface MatchFormValues {
  stage: MatchStage;
  groupId: string;
  round: MatchRound | '';
  teamAId: string;
  teamBId: string;
  date: string;
  time: string;
  location: string;
}

export interface MatchFormState extends FormErrorState {
  values: MatchFormValues;
}

export const EMPTY_MATCH_VALUES: MatchFormValues = {
  stage: 'GROUP',
  groupId: '',
  round: '',
  teamAId: '',
  teamBId: '',
  date: '',
  time: '',
  location: '',
};

export const INITIAL_MATCH_STATE: MatchFormState = {
  errorMessage: null,
  errorField: null,
  values: EMPTY_MATCH_VALUES,
};

export interface MatchTarget {
  matchId: string;
  categoryId: string;
  canChangeTeams: boolean;
}
