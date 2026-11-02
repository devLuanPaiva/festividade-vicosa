import { Injectable } from '@nestjs/common';
import type { Category } from '../../category/entities/category.entity';
import { CategoryService } from '../../category/services/category.service';
import type { Team } from '../../team/entities/team.entity';
import { TeamService } from '../../team/services/team.service';
import type { Match } from '../entities/match.entity';
import {
  MatchSearchRepository,
  type MatchScope,
  type MatchSearchCriteria,
} from '../repository/match-search.repository';
import type { SituationCounts } from '../rules/match-situation.rule';

export interface MatchListEntry {
  match: Match;
  teamA: Team;
  teamB: Team;
  category: Category;
}

export interface MatchListPage {
  entries: MatchListEntry[];
  total: number;
}

function indexById<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

function requireById<T>(index: Map<string, T>, id: string): T {
  const item = index.get(id);
  if (!item) {
    throw new Error(`Match references a record that does not exist: ${id}`);
  }
  return item;
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)];
}

@Injectable()
export class MatchListingService {
  public constructor(
    private readonly matchSearchRepository: MatchSearchRepository,
    private readonly categoryService: CategoryService,
    private readonly teamService: TeamService,
  ) {}

  public async list(criteria: MatchSearchCriteria, now: Date): Promise<MatchListPage> {
    const { matches, total } = await this.matchSearchRepository.search(criteria, now);
    return { entries: await this.attachDetails(matches), total };
  }

  public countSituations(scope: MatchScope, now: Date): Promise<SituationCounts> {
    return this.matchSearchRepository.countSituations(scope, now);
  }

  public listDays(scope: MatchScope): Promise<string[]> {
    return this.matchSearchRepository.listDays(scope);
  }

  private async attachDetails(matches: Match[]): Promise<MatchListEntry[]> {
    const teamIds = uniqueIds(matches.flatMap((match) => [match.teamAId, match.teamBId]));
    const categoryIds = uniqueIds(matches.map((match) => match.categoryId));
    const [teams, categories] = await Promise.all([
      this.teamService.listByIds(teamIds),
      this.categoryService.listByIds(categoryIds),
    ]);
    const teamsById = indexById(teams);
    const categoriesById = indexById(categories);
    return matches.map((match) => ({
      match,
      teamA: requireById(teamsById, match.teamAId),
      teamB: requireById(teamsById, match.teamBId),
      category: requireById(categoriesById, match.categoryId),
    }));
  }
}
