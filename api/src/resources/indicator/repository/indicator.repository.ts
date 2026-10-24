import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { DayRange } from '../rules/indicator-math.rule';

export const RECENT_RESULTS_LIMIT = 20;
const FORTALEZA_TIME_ZONE = 'America/Fortaleza';

export interface MatchTotalsRow {
  categories: number;
  teams: number;
  total: number;
  scheduled: number;
  finalized: number;
  today: number;
  overdue: number;
  walkovers: number;
  goals: number;
  playedMatches: number;
}

export interface MatchesByDayRow {
  date: string;
  scheduled: number;
  finalized: number;
}

export interface CategoryProgressRow {
  categoryId: string;
  name: string;
  gender: string;
  subEventName: string;
  teams: number;
  matches: number;
  finalized: number;
  goals: number;
  playedMatches: number;
}

export interface RecentResultRow {
  matchId: string;
  categoryName: string;
  teamAName: string;
  teamBName: string;
  scoreA: number | null;
  scoreB: number | null;
  resultType: string;
  finalizedAt: Date;
  finalizedByName: string | null;
}

const PLAYED_FINALIZED = `m.status = 'FINALIZED' AND m.result_type = 'PLAYED'`;

const MATCH_TOTALS_SQL = `
  SELECT
    (SELECT COUNT(*) FROM category)::int AS "categories",
    (SELECT COUNT(*) FROM team)::int AS "teams",
    COUNT(*)::int AS "total",
    COUNT(*) FILTER (WHERE m.status = 'SCHEDULED')::int AS "scheduled",
    COUNT(*) FILTER (WHERE m.status = 'FINALIZED')::int AS "finalized",
    COUNT(*) FILTER (WHERE m.scheduled_at >= $2 AND m.scheduled_at < $3)::int AS "today",
    COUNT(*) FILTER (WHERE m.status = 'SCHEDULED' AND m.scheduled_at < $1)::int AS "overdue",
    COUNT(*) FILTER (WHERE m.status = 'FINALIZED' AND m.result_type <> 'PLAYED')::int AS "walkovers",
    COALESCE(SUM(m.score_a + m.score_b) FILTER (WHERE ${PLAYED_FINALIZED}), 0)::int AS "goals",
    COUNT(*) FILTER (WHERE ${PLAYED_FINALIZED})::int AS "playedMatches"
  FROM match m`;

const MATCHES_BY_DAY_SQL = `
  SELECT
    to_char(m.scheduled_at AT TIME ZONE '${FORTALEZA_TIME_ZONE}', 'YYYY-MM-DD') AS "date",
    COUNT(*) FILTER (WHERE m.status = 'SCHEDULED')::int AS "scheduled",
    COUNT(*) FILTER (WHERE m.status = 'FINALIZED')::int AS "finalized"
  FROM match m
  GROUP BY 1
  ORDER BY 1`;

const CATEGORY_PROGRESS_SQL = `
  SELECT
    c.id AS "categoryId",
    c.name AS "name",
    c.gender AS "gender",
    s.name AS "subEventName",
    (SELECT COUNT(*) FROM team t WHERE t.category_id = c.id)::int AS "teams",
    COUNT(m.id)::int AS "matches",
    COUNT(m.id) FILTER (WHERE m.status = 'FINALIZED')::int AS "finalized",
    COALESCE(SUM(m.score_a + m.score_b) FILTER (WHERE ${PLAYED_FINALIZED}), 0)::int AS "goals",
    COUNT(m.id) FILTER (WHERE ${PLAYED_FINALIZED})::int AS "playedMatches"
  FROM category c
  JOIN sub_event s ON s.id = c.sub_event_id
  LEFT JOIN match m ON m.category_id = c.id
  GROUP BY c.id, s.name
  ORDER BY s.name, c.name`;

const RECENT_RESULTS_SQL = `
  SELECT
    m.id AS "matchId",
    c.name AS "categoryName",
    a.name AS "teamAName",
    b.name AS "teamBName",
    m.score_a AS "scoreA",
    m.score_b AS "scoreB",
    m.result_type AS "resultType",
    m.finalized_at AS "finalizedAt",
    u.name AS "finalizedByName"
  FROM match m
  JOIN category c ON c.id = m.category_id
  JOIN team a ON a.id = m.team_a_id
  JOIN team b ON b.id = m.team_b_id
  LEFT JOIN users u ON u.id = m.finalized_by_id
  WHERE m.status = 'FINALIZED'
  ORDER BY m.finalized_at DESC
  LIMIT $1`;

@Injectable()
export class IndicatorRepository {
  public constructor(private readonly dataSource: DataSource) {}

  public async findMatchTotals(now: Date, today: DayRange): Promise<MatchTotalsRow> {
    const [totals]: [MatchTotalsRow] = await this.dataSource.query(MATCH_TOTALS_SQL, [
      now,
      today.start,
      today.end,
    ]);
    return totals;
  }

  public countMatchesByDay(): Promise<MatchesByDayRow[]> {
    return this.dataSource.query(MATCHES_BY_DAY_SQL);
  }

  public findCategoryProgress(): Promise<CategoryProgressRow[]> {
    return this.dataSource.query(CATEGORY_PROGRESS_SQL);
  }

  public findRecentResults(): Promise<RecentResultRow[]> {
    return this.dataSource.query(RECENT_RESULTS_SQL, [RECENT_RESULTS_LIMIT]);
  }
}
