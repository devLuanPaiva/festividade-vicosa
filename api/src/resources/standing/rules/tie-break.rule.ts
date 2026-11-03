import {
  tallyStandings,
  type StandingMatch,
  type StandingRow,
  type StandingTeam,
} from './standing-tally.rule';

interface TieContext {
  miniTable: Map<string, StandingRow>;
}

type Metric = (row: StandingRow, context: TieContext) => number;

const FEWER_WALKOVER_LOSSES: Metric = (row) => -row.walkoverLosses;
const FEWER_GOALS_AGAINST: Metric = (row) => -row.goalsAgainst;
const MORE_GOALS_FOR: Metric = (row) => row.goalsFor;
const HEAD_TO_HEAD_POINTS: Metric = (row, context) =>
  context.miniTable.get(row.teamId)?.points ?? 0;
const MINI_TABLE_GOAL_DIFFERENCE: Metric = (row, context) =>
  context.miniTable.get(row.teamId)?.goalDifference ?? 0;

const PAIR_METRICS: Metric[] = [
  FEWER_WALKOVER_LOSSES,
  FEWER_GOALS_AGAINST,
  MORE_GOALS_FOR,
  HEAD_TO_HEAD_POINTS,
];

const GROUP_METRICS: Metric[] = [
  FEWER_WALKOVER_LOSSES,
  FEWER_GOALS_AGAINST,
  MINI_TABLE_GOAL_DIFFERENCE,
  MORE_GOALS_FOR,
];

function groupByDescending(
  rows: StandingRow[],
  valueOf: (row: StandingRow) => number,
): StandingRow[][] {
  const groups = new Map<number, StandingRow[]>();
  for (const row of rows) {
    const value = valueOf(row);
    groups.set(value, [...(groups.get(value) ?? []), row]);
  }
  return [...groups.entries()]
    .sort(([first], [second]) => second - first)
    .map(([, group]) => group);
}

function buildContext(tied: StandingRow[], matches: StandingMatch[]): TieContext {
  const teams: StandingTeam[] = tied.map((row) => ({ id: row.teamId, name: row.teamName }));
  const ids = new Set(teams.map((team) => team.id));
  const mutualMatches = matches.filter((match) => ids.has(match.teamAId) && ids.has(match.teamBId));
  const rows = tallyStandings(teams, mutualMatches);
  return { miniTable: new Map(rows.map((row) => [row.teamId, row])) };
}

function sortByName(rows: StandingRow[]): StandingRow[] {
  return [...rows].sort((first, second) => first.teamName.localeCompare(second.teamName, 'pt-BR'));
}

function resolveTie(tied: StandingRow[], matches: StandingMatch[]): StandingRow[] {
  if (tied.length < 2) {
    return tied;
  }
  const context = buildContext(tied, matches);
  const metrics = tied.length === 2 ? PAIR_METRICS : GROUP_METRICS;
  for (const metric of metrics) {
    const groups = groupByDescending(tied, (row) => metric(row, context));
    if (groups.length > 1) {
      return groups.flatMap((group) => resolveTie(group, matches));
    }
  }
  return sortByName(tied).map((row) => ({ ...row, tied: true }));
}

export function rankStandingRows(rows: StandingRow[], matches: StandingMatch[]): StandingRow[] {
  return groupByDescending(rows, (row) => row.points).flatMap((group) =>
    resolveTie(group, matches),
  );
}
