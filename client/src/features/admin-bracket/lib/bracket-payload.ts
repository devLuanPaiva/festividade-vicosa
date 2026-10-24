import { toScheduledAt } from '@/features/admin-matches/lib/match-schedule';
import type { BracketFormValues } from '../types';

export interface BracketPayload {
  teamIds: string[];
  scheduledAt: string;
  location?: string;
}

export function toBracketPayload(teamIds: string[], values: BracketFormValues): BracketPayload {
  return {
    teamIds,
    scheduledAt: toScheduledAt(values.date, values.time),
    ...(values.location && { location: values.location }),
  };
}
