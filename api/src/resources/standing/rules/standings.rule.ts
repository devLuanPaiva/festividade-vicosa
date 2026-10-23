import { rankStandingRows } from './tie-break.rule';
import {
  tallyStandings,
  type StandingMatch,
  type StandingRow,
  type StandingTeam,
} from './standing-tally.rule';

export function calculateStandings(teams: StandingTeam[], matches: StandingMatch[]): StandingRow[] {
  const rows = tallyStandings(teams, matches);
  return rankStandingRows(rows, matches).map((row, index) => ({ ...row, position: index + 1 }));
}
