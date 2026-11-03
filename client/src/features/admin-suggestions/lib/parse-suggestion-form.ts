import { readText } from '@/lib/forms/form-data';
import type { SuggestionFormValues, SuggestionRow } from '../types';

const ROW_FIELDS = [
  'stage',
  'groupId',
  'round',
  'bracketPosition',
  'matchId',
  'title',
  'note',
  'teamAId',
  'teamBId',
  'date',
  'time',
  'location',
] as const;

export function rowFieldName(index: number, field: string): string {
  return `rows.${index}.${field}`;
}

function readRow(formData: FormData, index: number): SuggestionRow {
  const text = (field: string): string => readText(formData, rowFieldName(index, field));
  const fields = Object.fromEntries(ROW_FIELDS.map((field) => [field, text(field)]));
  return {
    ...(fields as Omit<SuggestionRow, 'stage' | 'isIncluded'>),
    stage: fields.stage === 'KNOCKOUT' ? 'KNOCKOUT' : 'GROUP',
    isIncluded: formData.get(rowFieldName(index, 'include')) === 'on',
  };
}

export function parseSuggestionForm(formData: FormData): SuggestionFormValues {
  const rowCount = Number(readText(formData, 'rowCount')) || 0;
  return {
    rows: Array.from({ length: rowCount }, (_, index) => readRow(formData, index)),
    defaults: {
      date: readText(formData, 'defaultDate'),
      time: readText(formData, 'defaultTime'),
      location: readText(formData, 'defaultLocation'),
    },
  };
}
