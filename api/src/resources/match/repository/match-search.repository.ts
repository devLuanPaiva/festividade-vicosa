import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type SelectQueryBuilder } from 'typeorm';
import { escapeLikeText } from '../../../common/database/text-search';
import { Category } from '../../category/entities/category.entity';
import { Team } from '../../team/entities/team.entity';
import { Match } from '../entities/match.entity';
import { MatchStatus } from '../enums/match.enums';
import {
  dayWindow,
  MatchSituation,
  normalizedSql,
  normalizeSearchTerm,
  todayWindow,
  type SituationCounts,
} from '../rules/match-situation.rule';
import type { MatchFilters } from './match.repository';

export const MATCH_TIME_ZONE = 'America/Fortaleza';

export interface MatchScope extends MatchFilters {
  categoryId?: string;
  subEventId?: string;
  search?: string;
  day?: string;
}

export interface MatchSearchCriteria {
  scope: MatchScope;
  situation?: MatchSituation;
  descending: boolean;
  offset: number;
  limit: number;
}

export interface MatchSearchPage {
  matches: Match[];
  total: number;
}

type Query = SelectQueryBuilder<Match>;

const EQUALITY_COLUMNS = {
  stage: 'match.stage',
  groupId: 'match.groupId',
  round: 'match.round',
  status: 'match.status',
  categoryId: 'match.categoryId',
  subEventId: 'category.subEventId',
} as const;

const SEARCHABLE_TEXT = `concat_ws(' ', teamA.name, teamB.name, category.name,
  CASE category.gender WHEN 'MALE' THEN 'Masculino' ELSE 'Feminino' END, match.location)`;

const SITUATION_CONDITIONS: Record<MatchSituation, string> = {
  [MatchSituation.TODAY]: 'match.scheduledAt >= :todayStart AND match.scheduledAt < :todayEnd',
  [MatchSituation.OVERDUE]: 'match.status = :scheduledStatus AND match.scheduledAt < :now',
  [MatchSituation.SCHEDULED]: 'match.status = :scheduledStatus',
  [MatchSituation.FINALIZED]: 'match.status = :finalizedStatus',
};

function applyEquality(query: Query, scope: MatchScope): void {
  for (const [key, column] of Object.entries(EQUALITY_COLUMNS)) {
    const value = scope[key as keyof typeof EQUALITY_COLUMNS];
    if (value !== undefined) {
      query.andWhere(`${column} = :${key}`, { [key]: value });
    }
  }
}

function applyTeamAndRange(query: Query, scope: MatchScope): void {
  if (scope.teamId) {
    query.andWhere('(match.teamAId = :teamId OR match.teamBId = :teamId)', {
      teamId: scope.teamId,
    });
  }
  if (scope.scheduledFrom) {
    query.andWhere('match.scheduledAt >= :scheduledFrom', { scheduledFrom: scope.scheduledFrom });
  }
  if (scope.scheduledTo) {
    query.andWhere('match.scheduledAt <= :scheduledTo', { scheduledTo: scope.scheduledTo });
  }
}

function applyDay(query: Query, scope: MatchScope): void {
  if (scope.day) {
    const { start, end } = dayWindow(scope.day);
    query.andWhere('match.scheduledAt >= :dayStart AND match.scheduledAt < :dayEnd', {
      dayStart: start,
      dayEnd: end,
    });
  }
}

function applySearch(query: Query, scope: MatchScope): void {
  const term = normalizeSearchTerm(scope.search ?? '');
  if (term) {
    query.andWhere(`${normalizedSql(SEARCHABLE_TEXT)} LIKE :term`, {
      term: `%${escapeLikeText(term)}%`,
    });
  }
}

function situationParameters(now: Date): Record<string, unknown> {
  const { start, end } = todayWindow(now);
  return {
    now,
    todayStart: start,
    todayEnd: end,
    scheduledStatus: MatchStatus.SCHEDULED,
    finalizedStatus: MatchStatus.FINALIZED,
  };
}

function applySituation(query: Query, situation: MatchSituation | undefined, now: Date): void {
  if (situation) {
    query.andWhere(SITUATION_CONDITIONS[situation], situationParameters(now));
  }
}

function countWhere(situation: MatchSituation): string {
  return `count(*) FILTER (WHERE ${SITUATION_CONDITIONS[situation]})`;
}

function toCount(value: string | undefined): number {
  return Number(value ?? 0);
}

@Injectable()
export class MatchSearchRepository {
  public constructor(@InjectRepository(Match) private readonly repository: Repository<Match>) {}

  public async search(criteria: MatchSearchCriteria, now: Date): Promise<MatchSearchPage> {
    const query = this.scopedQuery(criteria.scope);
    applySituation(query, criteria.situation, now);
    const total = await query.clone().getCount();
    const direction = criteria.descending ? 'DESC' : 'ASC';
    const matches = await query
      .orderBy('match.scheduledAt', direction)
      .addOrderBy('match.id', direction)
      .offset(criteria.offset)
      .limit(criteria.limit)
      .getMany();
    return { matches, total };
  }

  public async countSituations(scope: MatchScope, now: Date): Promise<SituationCounts> {
    const row = await this.scopedQuery(scope)
      .select('count(*)', 'total')
      .addSelect(countWhere(MatchSituation.TODAY), 'today')
      .addSelect(countWhere(MatchSituation.OVERDUE), 'overdue')
      .addSelect(countWhere(MatchSituation.SCHEDULED), 'scheduled')
      .addSelect(countWhere(MatchSituation.FINALIZED), 'finalized')
      .setParameters(situationParameters(now))
      .getRawOne<Record<keyof SituationCounts, string>>();
    return {
      total: toCount(row?.total),
      today: toCount(row?.today),
      overdue: toCount(row?.overdue),
      scheduled: toCount(row?.scheduled),
      finalized: toCount(row?.finalized),
    };
  }

  public async listDays(scope: MatchScope): Promise<string[]> {
    const rows = await this.scopedQuery(scope)
      .select(`to_char(match.scheduledAt AT TIME ZONE :timeZone, 'YYYY-MM-DD')`, 'day')
      .setParameter('timeZone', MATCH_TIME_ZONE)
      .groupBy('day')
      .orderBy('day', 'ASC')
      .getRawMany<{ day: string }>();
    return rows.map((row) => row.day);
  }

  private scopedQuery(scope: MatchScope): Query {
    const query = this.repository
      .createQueryBuilder('match')
      .innerJoin(Category, 'category', 'category.id = match.categoryId')
      .innerJoin(Team, 'teamA', 'teamA.id = match.teamAId')
      .innerJoin(Team, 'teamB', 'teamB.id = match.teamBId');
    for (const apply of [applyEquality, applyTeamAndRange, applyDay, applySearch]) {
      apply(query, scope);
    }
    return query;
  }
}
