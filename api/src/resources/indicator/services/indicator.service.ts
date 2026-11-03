import { Injectable } from '@nestjs/common';
import type {
  CategoryProgressResponseDto,
  MatchesByDayResponseDto,
  OverviewResponseDto,
  RecentResultResponseDto,
} from '../dto/indicator-response.dto';
import { IndicatorRepository } from '../repository/indicator.repository';
import { averagePerMatch, dayRangeInFortaleza, toPercentage } from '../rules/indicator-math.rule';

@Injectable()
export class IndicatorService {
  public constructor(private readonly indicatorRepository: IndicatorRepository) {}

  public async getOverview(now: Date = new Date()): Promise<OverviewResponseDto> {
    const totals = await this.indicatorRepository.findMatchTotals(now, dayRangeInFortaleza(now));
    return {
      categories: totals.categories,
      teams: totals.teams,
      matches: {
        total: totals.total,
        scheduled: totals.scheduled,
        finalized: totals.finalized,
        today: totals.today,
        overdue: totals.overdue,
        walkovers: totals.walkovers,
        completionRate: toPercentage(totals.finalized, totals.total),
      },
      goals: {
        total: totals.goals,
        perMatch: averagePerMatch(totals.goals, totals.playedMatches),
      },
    };
  }

  public listMatchesByDay(): Promise<MatchesByDayResponseDto[]> {
    return this.indicatorRepository.countMatchesByDay();
  }

  public async listCategoryProgress(): Promise<CategoryProgressResponseDto[]> {
    const rows = await this.indicatorRepository.findCategoryProgress();
    return rows.map(({ playedMatches, ...row }) => ({
      ...row,
      completionRate: toPercentage(row.finalized, row.matches),
      goalsPerMatch: averagePerMatch(row.goals, playedMatches),
    }));
  }

  public async listRecentResults(): Promise<RecentResultResponseDto[]> {
    const rows = await this.indicatorRepository.findRecentResults();
    return rows.map((row) => ({ ...row, finalizedAt: row.finalizedAt.toISOString() }));
  }
}
