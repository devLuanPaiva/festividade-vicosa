import { readText } from '@/lib/forms/form-data';
import type { TeamFormValues } from '../types';

export interface TeamPayload {
  name: string;
  city: string;
  abbreviation: string | null;
  groupId: string | null;
}

export function parseTeamForm(formData: FormData): TeamFormValues {
  return {
    name: readText(formData, 'name'),
    city: readText(formData, 'city'),
    abbreviation: readText(formData, 'abbreviation'),
    groupId: readText(formData, 'groupId'),
  };
}

export function toTeamPayload(values: TeamFormValues): TeamPayload {
  return {
    name: values.name,
    city: values.city,
    abbreviation: values.abbreviation || null,
    groupId: values.groupId || null,
  };
}
