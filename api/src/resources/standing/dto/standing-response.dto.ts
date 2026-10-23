import type { SeededTeam } from '../rules/seeding.rule';
import type { StandingRow } from '../rules/standing-tally.rule';

export type StandingRowResponseDto = StandingRow & { qualifiedPosition: number | null };

export type SeededTeamResponseDto = SeededTeam;

export interface GroupStandingsResponseDto {
  groupId: string;
  groupName: string;
  rows: StandingRowResponseDto[];
}
