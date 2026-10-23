import { Injectable } from '@nestjs/common';
import { MatchGroupService } from '../../match-group/services/match-group.service';
import { MatchStage, MatchStatus } from '../../match/enums/match.enums';
import { MatchService } from '../../match/services/match.service';
import { TeamService } from '../../team/services/team.service';
import type {
  GroupStandingsResponseDto,
  StandingRowResponseDto,
} from '../dto/standing-response.dto';
import { calculateStandings } from '../rules/standings.rule';

interface GroupReference {
  id: string;
  name: string;
}

@Injectable()
export class StandingService {
  public constructor(
    private readonly matchGroupService: MatchGroupService,
    private readonly teamService: TeamService,
    private readonly matchService: MatchService,
  ) {}

  public async listByCategory(categoryId: string): Promise<GroupStandingsResponseDto[]> {
    const groups = await this.matchGroupService.listByCategory(categoryId, {});
    return this.calculateForGroups(categoryId, groups);
  }

  public async getByGroup(groupId: string): Promise<StandingRowResponseDto[]> {
    const group = await this.matchGroupService.findByIdOrFail(groupId);
    const [standings] = await this.calculateForGroups(group.categoryId, [group]);
    return standings?.rows ?? [];
  }

  private async calculateForGroups(
    categoryId: string,
    groups: GroupReference[],
  ): Promise<GroupStandingsResponseDto[]> {
    const [teams, matches] = await Promise.all([
      this.teamService.listByCategory(categoryId, {}),
      this.matchService.listByCategory(categoryId, {
        stage: MatchStage.GROUP,
        status: MatchStatus.FINALIZED,
      }),
    ]);
    return groups.map((group) => ({
      groupId: group.id,
      groupName: group.name,
      rows: calculateStandings(
        teams.filter((team) => team.groupId === group.id),
        matches.filter((match) => match.groupId === group.id),
      ),
    }));
  }
}
