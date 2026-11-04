import { toScheduledAt } from '@/features/admin-matches/lib/match-schedule';
import { readText } from '@/lib/forms/form-data';
import type { LiveFormValues } from '../types';

export interface LivePayload {
  title: string;
  url: string;
  startsAt: string;
}

export function parseLiveForm(formData: FormData): LiveFormValues {
  return {
    title: readText(formData, 'title'),
    url: readText(formData, 'url'),
    date: readText(formData, 'date'),
    time: readText(formData, 'time'),
  };
}

export function toLivePayload(values: LiveFormValues): LivePayload {
  return {
    title: values.title,
    url: values.url,
    startsAt: toScheduledAt(values.date, values.time),
  };
}
