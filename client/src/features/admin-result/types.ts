import type { MatchResultType } from '@/features/games/types';

export interface ResultDraft {
  resultType: MatchResultType;
  scoreA: string;
  scoreB: string;
  penaltiesA: string;
  penaltiesB: string;
  walkoverWinnerId: string;
  bestPlayerName: string;
  bestPlayerTeamId: string;
}

export type ResultDraftField = keyof ResultDraft;

export type ResultDraftChange = <Field extends ResultDraftField>(
  field: Field,
  value: ResultDraft[Field],
) => void;

export interface ResultValues {
  resultType: MatchResultType;
  scoreA: number | null;
  scoreB: number | null;
  penaltiesA: number | null;
  penaltiesB: number | null;
  walkoverWinnerId: string | null;
  bestPlayerName: string;
  bestPlayerTeamId: string | null;
  bestPlayerPhotoKey: string | null;
}

export interface ResultPayload {
  resultType: MatchResultType;
  scoreA?: number | null;
  scoreB?: number | null;
  penaltiesA?: number | null;
  penaltiesB?: number | null;
  walkoverWinnerId?: string | null;
  bestPlayerName?: string;
  bestPlayerTeamId?: string | null;
  bestPlayerPhotoKey?: string;
}

export interface ResultFormState {
  errorMessage: string | null;
  errorField: string | null;
}

export const INITIAL_RESULT_STATE: ResultFormState = {
  errorMessage: null,
  errorField: null,
};
