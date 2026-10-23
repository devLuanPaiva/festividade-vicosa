import type { StandingRow } from '../rules/standings.rule';

export type StandingRowResponseDto = StandingRow;

export interface GroupStandingsResponseDto {
  groupId: string;
  groupName: string;
  rows: StandingRowResponseDto[];
}
