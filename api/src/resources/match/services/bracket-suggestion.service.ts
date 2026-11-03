import { Injectable } from '@nestjs/common';
import { CategoryService } from '../../category/services/category.service';
import { TeamService } from '../../team/services/team.service';
import type { BracketMatchSuggestionDto } from '../dto/match-suggestion.dto';
import { MatchStage } from '../enums/match.enums';
import { MatchRepository } from '../repository/match.repository';
import { findBracketTeamsProblem, firstRoundFor, pairFirstRound } from '../rules/bracket.rule';
import { suggestNextMatches } from '../rules/next-round.rule';
import { problem } from '../rules/rule-problem';
import { toBadRequest } from './match-fixture-validator.service';

@Injectable()
export class BracketSuggestionService {
  public constructor(
    private readonly matchRepository: MatchRepository,
    private readonly categoryService: CategoryService,
    private readonly teamService: TeamService,
  ) {}

  public async suggestFirstRound(
    categoryId: string,
    teamIds: string[],
  ): Promise<BracketMatchSuggestionDto[]> {
    await this.categoryService.findByIdOrFail(categoryId);
    const teamsProblem = findBracketTeamsProblem(teamIds);
    if (teamsProblem) {
      throw toBadRequest(teamsProblem);
    }
    await this.assertTeamsBelongToCategory(categoryId, teamIds);
    const round = firstRoundFor(teamIds.length);
    return pairFirstRound(teamIds).map((pairing) => ({
      ...pairing,
      round,
      scheduledAt: null,
      matchId: null,
    }));
  }

  public async suggestNextMatches(categoryId: string): Promise<BracketMatchSuggestionDto[]> {
    await this.categoryService.findByIdOrFail(categoryId);
    const knockout = await this.matchRepository.findByCategory(categoryId, {
      stage: MatchStage.KNOCKOUT,
    });
    return suggestNextMatches(knockout).map((suggestion) => ({
      ...suggestion,
      scheduledAt: suggestion.scheduledAt.toISOString(),
    }));
  }

  private async assertTeamsBelongToCategory(categoryId: string, teamIds: string[]): Promise<void> {
    const teams = await this.teamService.listByIds(teamIds);
    const belong = teams.filter((team) => team.categoryId === categoryId);
    if (belong.length !== teamIds.length) {
      throw toBadRequest(
        problem('TEAM_NOT_IN_CATEGORY', 'Algum time informado não é desta categoria.', 'teamIds'),
      );
    }
  }
}
