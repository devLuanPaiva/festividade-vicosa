import type { Match } from '@/features/games/types';
import type { MatchFormValues } from '../types';
import { toDateInput, toTimeInput } from './match-schedule';

export function toMatchFormValues(match: Match): MatchFormValues {
  return {
    stage: match.stage,
    groupId: match.groupId ?? '',
    round: match.round ?? '',
    teamAId: match.teamAId,
    teamBId: match.teamBId,
    date: toDateInput(match.scheduledAt),
    time: toTimeInput(match.scheduledAt),
    location: match.location ?? '',
  };
}
