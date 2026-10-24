import type { MatchResultType } from '@/features/games/types';
import { readText } from '@/lib/forms/form-data';
import type { ResultValues } from '../types';

const RESULT_TYPES: MatchResultType[] = ['PLAYED', 'WALKOVER', 'DOUBLE_WALKOVER'];

function readInteger(formData: FormData, name: string): number | null {
  const text = readText(formData, name);
  const value = Number(text);
  return text !== '' && Number.isInteger(value) ? value : null;
}

function readOptionalText(formData: FormData, name: string): string | null {
  return readText(formData, name) || null;
}

function readResultType(formData: FormData): MatchResultType {
  const value = readText(formData, 'resultType');
  return RESULT_TYPES.find((type) => type === value) ?? 'PLAYED';
}

export function parseResultForm(formData: FormData): ResultValues {
  return {
    resultType: readResultType(formData),
    scoreA: readInteger(formData, 'scoreA'),
    scoreB: readInteger(formData, 'scoreB'),
    penaltiesA: readInteger(formData, 'penaltiesA'),
    penaltiesB: readInteger(formData, 'penaltiesB'),
    walkoverWinnerId: readOptionalText(formData, 'walkoverWinnerId'),
    bestPlayerName: readText(formData, 'bestPlayerName'),
    bestPlayerTeamId: readOptionalText(formData, 'bestPlayerTeamId'),
    bestPlayerPhotoKey: readOptionalText(formData, 'bestPlayerPhotoKey'),
  };
}
