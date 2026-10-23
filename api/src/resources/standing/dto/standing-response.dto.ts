import type { StandingRow } from '../rules/standing-tally.rule';

export type StandingRowResponseDto = StandingRow;

export interface GroupStandingsResponseDto {
  groupId: string;
  groupName: string;
  rows: StandingRowResponseDto[];
}
