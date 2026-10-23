import { Injectable } from '@nestjs/common';
import { MatchGroupService } from '../../match-group/services/match-group.service';
import type {
  GroupStandingsResponseDto,
  SeededTeamResponseDto,
  StandingRowResponseDto,
} from '../dto/standing-response.dto';
import { seedQualifiedTeams } from '../rules/seeding.rule';
import { calculateStandings } from '../rules/standings.rule';
import { StandingDataLoader, qualifiedKey, type StandingData } from './standing-data.loader';

interface GroupReference {
  id: string;
  name: string;
}

function buildGroupStandings(group: GroupReference, data: StandingData): GroupStandingsResponseDto {
  const rows = calculateStandings(
    data.teams.filter((team) => team.groupId === group.id),
    data.matches.filter((match) => match.groupId === group.id),
  );
  return {
    groupId: group.id,
    groupName: group.name,
    rows: rows.map((row) => ({
      ...row,
      qualifiedPosition: data.qualifiedPositions.get(qualifiedKey(group.id, row.teamId)) ?? null,
    })),
  };
}

@Injectable()
export class StandingService {
  public constructor(
    private readonly matchGroupService: MatchGroupService,
    private readonly dataLoader: StandingDataLoader,
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

  public async listSeeding(categoryId: string): Promise<SeededTeamResponseDto[]> {
    return seedQualifiedTeams(await this.listByCategory(categoryId));
  }

  private async calculateForGroups(
    categoryId: string,
    groups: GroupReference[],
  ): Promise<GroupStandingsResponseDto[]> {
    const data = await this.dataLoader.load(
      categoryId,
      groups.map((group) => group.id),
    );
    return groups.map((group) => buildGroupStandings(group, data));
  }
}
