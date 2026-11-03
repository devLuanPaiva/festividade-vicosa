import { Injectable } from '@nestjs/common';
import { MatchGroupService } from '../../match-group/services/match-group.service';
import { TeamService } from '../../team/services/team.service';
import type { FixtureSuggestionDto } from '../dto/match-suggestion.dto';
import { MatchRepository } from '../repository/match.repository';
import { suggestMissingFixtures } from '../rules/group-fixture.rule';

@Injectable()
export class GroupFixtureSuggestionService {
  public constructor(
    private readonly matchRepository: MatchRepository,
    private readonly matchGroupService: MatchGroupService,
    private readonly teamService: TeamService,
  ) {}

  public async suggest(groupId: string): Promise<FixtureSuggestionDto[]> {
    const group = await this.matchGroupService.findByIdOrFail(groupId);
    const [teams, matches] = await Promise.all([
      this.teamService.listByCategory(group.categoryId, { groupId }),
      this.matchRepository.findByCategory(group.categoryId, { groupId }),
    ]);
    const existingPairs = matches.map((match): [string, string] => [match.teamAId, match.teamBId]);
    return suggestMissingFixtures(
      teams.map((team) => team.id),
      existingPairs,
    );
  }
}
