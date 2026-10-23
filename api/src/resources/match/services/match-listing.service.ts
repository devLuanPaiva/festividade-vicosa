import { Injectable } from '@nestjs/common';
import type { Category } from '../../category/entities/category.entity';
import { CategoryService } from '../../category/services/category.service';
import type { Team } from '../../team/entities/team.entity';
import { TeamService } from '../../team/services/team.service';
import type { Match } from '../entities/match.entity';
import { MatchRepository, type MatchFilters } from '../repository/match.repository';

export interface MatchListFilters extends MatchFilters {
  categoryId?: string;
  subEventId?: string;
}

export interface MatchListEntry {
  match: Match;
  teamA: Team;
  teamB: Team;
  category: Category;
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
    private readonly matchRepository: MatchRepository,
    private readonly categoryService: CategoryService,
    private readonly teamService: TeamService,
  ) {}

  public async list(filters: MatchListFilters): Promise<MatchListEntry[]> {
    const { categoryId, subEventId, ...matchFilters } = filters;
    const categoryIds = await this.resolveCategoryIds(categoryId, subEventId);
    if (categoryIds?.length === 0) {
      return [];
    }
    const matches = await this.matchRepository.findInCategories(categoryIds, matchFilters);
    return this.attachDetails(matches);
  }

  private async resolveCategoryIds(
    categoryId?: string,
    subEventId?: string,
  ): Promise<string[] | undefined> {
    if (subEventId) {
      const categories = await this.categoryService.listBySubEvent(subEventId, {});
      const ids = categories.map((category) => category.id);
      return categoryId ? ids.filter((id) => id === categoryId) : ids;
    }
    if (categoryId) {
      await this.categoryService.findByIdOrFail(categoryId);
      return [categoryId];
    }
    return undefined;
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
