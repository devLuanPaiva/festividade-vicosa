import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  type FindOperator,
  type FindOptionsWhere,
} from 'typeorm';
import { Match } from '../entities/match.entity';
import {
  MatchStatus,
  type MatchResultType,
  type MatchRound,
  type MatchStage,
} from '../enums/match.enums';

export interface MatchRecord {
  categoryId: string;
  stage: MatchStage;
  groupId: string | null;
  round: MatchRound | null;
  bracketPosition: number | null;
  scheduledAt: Date;
  location: string | null;
  teamAId: string;
  teamBId: string;
}

export type MatchChanges = Partial<
  Pick<MatchRecord, 'scheduledAt' | 'location' | 'teamAId' | 'teamBId'>
>;

export interface MatchResultRecord {
  resultType: MatchResultType;
  scoreA: number | null;
  scoreB: number | null;
  penaltiesA: number | null;
  penaltiesB: number | null;
  winnerId: string | null;
  finalizedById: string;
  finalizedAt: Date;
  bestPlayerName: string | null;
  bestPlayerPhotoKey: string | null;
  bestPlayerTeamId: string | null;
}

export interface MatchFilters {
  stage?: MatchStage;
  groupId?: string;
  round?: MatchRound;
  status?: MatchStatus;
  teamId?: string;
  scheduledFrom?: string;
  scheduledTo?: string;
}

function scheduledAtRange(from?: string, to?: string): FindOperator<Date> | undefined {
  if (from && to) {
    return Between(new Date(from), new Date(to));
  }
  if (from) {
    return MoreThanOrEqual(new Date(from));
  }
  return to ? LessThanOrEqual(new Date(to)) : undefined;
}

const DIRECT_FILTERS = ['stage', 'groupId', 'round', 'status'] as const;

function directFilters(filters: MatchFilters): FindOptionsWhere<Match> {
  const present = DIRECT_FILTERS.filter((key) => filters[key] !== undefined);
  return Object.fromEntries(present.map((key) => [key, filters[key]]));
}

function buildWhere(
  scope: FindOptionsWhere<Match>,
  filters: MatchFilters,
): FindOptionsWhere<Match>[] {
  const scheduledAt = scheduledAtRange(filters.scheduledFrom, filters.scheduledTo);
  const base: FindOptionsWhere<Match> = {
    ...scope,
    ...directFilters(filters),
    ...(scheduledAt && { scheduledAt }),
  };
  return filters.teamId
    ? [
        { ...base, teamAId: filters.teamId },
        { ...base, teamBId: filters.teamId },
      ]
    : [base];
}

@Injectable()
export class MatchRepository {
  public constructor(@InjectRepository(Match) private readonly repository: Repository<Match>) {}

  public findByCategory(categoryId: string, filters: MatchFilters): Promise<Match[]> {
    return this.repository.find({
      where: buildWhere({ categoryId }, filters),
      order: { scheduledAt: 'ASC', id: 'ASC' },
    });
  }

  public findInCategories(
    categoryIds: string[] | undefined,
    filters: MatchFilters,
  ): Promise<Match[]> {
    const scope = categoryIds ? { categoryId: In(categoryIds) } : {};
    return this.repository.find({
      where: buildWhere(scope, filters),
      order: { scheduledAt: 'ASC', id: 'ASC' },
    });
  }

  public findById(id: string): Promise<Match | null> {
    return this.repository.findOneBy({ id });
  }

  public findBracketMatch(
    categoryId: string,
    round: MatchRound,
    bracketPosition: number,
  ): Promise<Match | null> {
    return this.repository.findOneBy({ categoryId, round, bracketPosition });
  }

  public create(record: MatchRecord): Promise<Match> {
    return this.repository.save(
      this.repository.create({ ...record, status: MatchStatus.SCHEDULED }),
    );
  }

  public createMany(records: MatchRecord[]): Promise<Match[]> {
    return this.repository.save(
      records.map((record) => this.repository.create({ ...record, status: MatchStatus.SCHEDULED })),
    );
  }

  public update(id: string, changes: MatchChanges): Promise<unknown> {
    return this.repository.update({ id }, changes);
  }

  public saveResult(id: string, result: MatchResultRecord): Promise<unknown> {
    return this.repository.update({ id }, { ...result, status: MatchStatus.FINALIZED });
  }

  public remove(id: string): Promise<unknown> {
    return this.repository.delete({ id });
  }
}
