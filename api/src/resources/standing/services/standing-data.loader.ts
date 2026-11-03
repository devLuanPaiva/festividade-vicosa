import { Injectable } from '@nestjs/common';
import { MatchStage, MatchStatus } from '../../match/enums/match.enums';
import type { Match } from '../../match/entities/match.entity';
import { MatchService } from '../../match/services/match.service';
import { QualificationService } from '../../qualification/services/qualification.service';
import type { Team } from '../../team/entities/team.entity';
import { TeamService } from '../../team/services/team.service';

export interface StandingData {
  teams: Team[];
  matches: Match[];
  qualifiedPositions: Map<string, number>;
}

export function qualifiedKey(groupId: string, teamId: string): string {
  return `${groupId}:${teamId}`;
}

@Injectable()
export class StandingDataLoader {
  public constructor(
    private readonly teamService: TeamService,
    private readonly matchService: MatchService,
    private readonly qualificationService: QualificationService,
  ) {}

  public async load(categoryId: string, groupIds: string[]): Promise<StandingData> {
    const [teams, matches, qualified] = await Promise.all([
      this.teamService.listByCategory(categoryId, {}),
      this.matchService.listByCategory(categoryId, {
        stage: MatchStage.GROUP,
        status: MatchStatus.FINALIZED,
      }),
      this.qualificationService.listByGroups(groupIds),
    ]);
    const qualifiedPositions = new Map(
      qualified.map((entry) => [qualifiedKey(entry.groupId, entry.teamId), entry.position]),
    );
    return { teams, matches, qualifiedPositions };
  }
}
