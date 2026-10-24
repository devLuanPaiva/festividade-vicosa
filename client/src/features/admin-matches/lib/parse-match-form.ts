import type { MatchRound, MatchStage } from '@/features/games/types';
import { readText } from '@/lib/forms/form-data';
import type { MatchFormValues } from '../types';
import { KNOCKOUT_ROUNDS } from './match-form-options';
import { toScheduledAt } from './match-schedule';

export interface CreateMatchPayload {
  stage: MatchStage;
  scheduledAt: string;
  teamAId: string;
  teamBId: string;
  location?: string;
  groupId?: string;
  round?: MatchRound;
}

export interface UpdateMatchPayload {
  scheduledAt: string;
  location: string;
  teamAId?: string;
  teamBId?: string;
}

export function parseStage(value: string): MatchStage {
  return value === 'KNOCKOUT' ? 'KNOCKOUT' : 'GROUP';
}

function parseRound(value: string): MatchRound | '' {
  return KNOCKOUT_ROUNDS.find((round) => round === value) ?? '';
}

export function parseMatchForm(formData: FormData): MatchFormValues {
  return {
    stage: parseStage(readText(formData, 'stage')),
    groupId: readText(formData, 'groupId'),
    round: parseRound(readText(formData, 'round')),
    teamAId: readText(formData, 'teamAId'),
    teamBId: readText(formData, 'teamBId'),
    date: readText(formData, 'date'),
    time: readText(formData, 'time'),
    location: readText(formData, 'location'),
  };
}

export function toCreateMatchPayload(values: MatchFormValues): CreateMatchPayload {
  const payload: CreateMatchPayload = {
    stage: values.stage,
    scheduledAt: toScheduledAt(values.date, values.time),
    teamAId: values.teamAId,
    teamBId: values.teamBId,
    ...(values.location && { location: values.location }),
  };
  return values.stage === 'GROUP'
    ? { ...payload, groupId: values.groupId }
    : { ...payload, round: values.round || undefined };
}

export function toUpdateMatchPayload(
  values: MatchFormValues,
  canChangeTeams: boolean,
): UpdateMatchPayload {
  const payload: UpdateMatchPayload = {
    scheduledAt: toScheduledAt(values.date, values.time),
    location: values.location,
  };
  return canChangeTeams
    ? { ...payload, teamAId: values.teamAId, teamBId: values.teamBId }
    : payload;
}
