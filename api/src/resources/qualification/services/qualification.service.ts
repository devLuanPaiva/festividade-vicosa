import { Injectable } from '@nestjs/common';
import { MatchGroupService } from '../../match-group/services/match-group.service';
import { toBadRequest } from '../../match/services/match-fixture-validator.service';
import { TeamService } from '../../team/services/team.service';
import type { QualifiedTeam } from '../entities/qualified-team.entity';
import { QualifiedTeamRepository } from '../repository/qualified-team.repository';
import { findQualifiedTeamsProblem } from '../rules/qualified-teams.rule';

@Injectable()
export class QualificationService {
  public constructor(
    private readonly qualifiedTeamRepository: QualifiedTeamRepository,
    private readonly matchGroupService: MatchGroupService,
    private readonly teamService: TeamService,
  ) {}

  public listByGroups(groupIds: string[]): Promise<QualifiedTeam[]> {
    return this.qualifiedTeamRepository.findByGroups(groupIds);
  }

  public async confirm(groupId: string, teamIds: string[]): Promise<QualifiedTeam[]> {
    const group = await this.matchGroupService.findByIdOrFail(groupId);
    const teams = await this.teamService.listByCategory(group.categoryId, { groupId });
    const problem = findQualifiedTeamsProblem(
      teams.map((team) => team.id),
      teamIds,
    );
    if (problem) {
      throw toBadRequest(problem);
    }
    return this.qualifiedTeamRepository.replaceForGroup(
      groupId,
      teamIds.map((teamId, index) => ({ teamId, position: index + 1 })),
    );
  }
}
