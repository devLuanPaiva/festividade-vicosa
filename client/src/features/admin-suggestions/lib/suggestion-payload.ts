import { toScheduledAt } from '@/features/admin-matches/lib/match-schedule';
import type { FormErrorState } from '@/lib/forms/form-errors';
import { rowFieldName } from './parse-suggestion-form';
import type { SuggestionDefaults, SuggestionRow } from '../types';

export interface BatchMatchPayload {
  stage: 'GROUP' | 'KNOCKOUT';
  groupId?: string;
  round?: string;
  bracketPosition?: number;
  scheduledAt: string;
  location?: string;
  teamAId: string;
  teamBId: string;
}

export interface MatchUpdatePayload {
  scheduledAt: string;
  location: string;
  teamAId: string;
  teamBId: string;
}

export interface IndexedRow {
  index: number;
  row: SuggestionRow;
}

const MISSING_SCHEDULE_MESSAGE =
  'Informe a data e a hora da partida, ou preencha os valores padrão no topo.';

export function scheduleOf(row: SuggestionRow, defaults: SuggestionDefaults): string {
  return toScheduledAt(row.date || defaults.date, row.time || defaults.time);
}

function locationOf(row: SuggestionRow, defaults: SuggestionDefaults): string {
  return row.location || defaults.location;
}

export function toBatchMatch(row: SuggestionRow, defaults: SuggestionDefaults): BatchMatchPayload {
  const location = locationOf(row, defaults);
  return {
    stage: row.stage,
    ...(row.groupId && { groupId: row.groupId }),
    ...(row.round && { round: row.round }),
    ...(row.bracketPosition && { bracketPosition: Number(row.bracketPosition) }),
    scheduledAt: scheduleOf(row, defaults),
    ...(location && { location }),
    teamAId: row.teamAId,
    teamBId: row.teamBId,
  };
}

export function toMatchUpdate(
  row: SuggestionRow,
  defaults: SuggestionDefaults,
): MatchUpdatePayload {
  return {
    scheduledAt: scheduleOf(row, defaults),
    location: locationOf(row, defaults),
    teamAId: row.teamAId,
    teamBId: row.teamBId,
  };
}

export function findRowWithoutSchedule(
  included: IndexedRow[],
  defaults: SuggestionDefaults,
): FormErrorState | null {
  const missing = included.find(({ row }) => !scheduleOf(row, defaults));
  return missing
    ? {
        errorMessage: MISSING_SCHEDULE_MESSAGE,
        errorField: rowFieldName(missing.index, 'date'),
      }
    : null;
}

const BATCH_FIELD_PATTERN = /^matches\.(\d+)\.(.+)$/;
const ROW_FIELD_BY_PAYLOAD_FIELD: Record<string, string> = { scheduledAt: 'date' };

export function toRowFailure(failure: FormErrorState, creations: IndexedRow[]): FormErrorState {
  const [, position, field] = BATCH_FIELD_PATTERN.exec(failure.errorField ?? '') ?? [];
  const created = creations[Number(position)];
  if (!created || !field) {
    return failure;
  }
  const rowField = ROW_FIELD_BY_PAYLOAD_FIELD[field] ?? field;
  return { ...failure, errorField: rowFieldName(created.index, rowField) };
}
