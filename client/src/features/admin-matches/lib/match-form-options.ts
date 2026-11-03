import type { SelectOption } from '@/components/ui/SelectField';
import type { MatchRound, MatchStage, Team } from '@/features/games/types';

export const KNOCKOUT_ROUNDS: MatchRound[] = [
  'ROUND_OF_32',
  'ROUND_OF_16',
  'QUARTER_FINAL',
  'SEMI_FINAL',
  'THIRD_PLACE',
  'FINAL',
];

export const STAGE_OPTIONS: SelectOption[] = [
  { value: 'GROUP', label: 'Fase de grupos' },
  { value: 'KNOCKOUT', label: 'Mata-mata' },
];

export function teamsOfGroup(teams: Team[], stage: MatchStage, groupId: string): Team[] {
  return stage === 'GROUP' ? teams.filter((team) => team.groupId === groupId) : teams;
}

export function toTeamOptions(teams: Team[], placeholder: string): SelectOption[] {
  return [
    { value: '', label: placeholder },
    ...teams.map((team) => ({ value: team.id, label: team.name })),
  ];
}
