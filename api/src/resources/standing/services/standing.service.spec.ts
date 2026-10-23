import { NotFoundException } from '@nestjs/common';
import type { MatchGroupService } from '../../match-group/services/match-group.service';
import { MatchResultType, MatchStage, MatchStatus } from '../../match/enums/match.enums';
import type { MatchService } from '../../match/services/match.service';
import type { TeamService } from '../../team/services/team.service';
import { StandingService } from './standing.service';

const CATEGORY = '00000000-0000-4000-8000-000000000005';
const GROUP_A = {
  id: '00000000-0000-4000-8000-0000000000a0',
  categoryId: CATEGORY,
  name: 'Grupo A',
};
const GROUP_B = {
  id: '00000000-0000-4000-8000-0000000000b0',
  categoryId: CATEGORY,
  name: 'Grupo B',
};

const teams = [
  { id: 'alfa', name: 'Alfa', groupId: GROUP_A.id },
  { id: 'beta', name: 'Beta', groupId: GROUP_A.id },
  { id: 'gama', name: 'Gama', groupId: GROUP_B.id },
  { id: 'delta', name: 'Delta', groupId: null },
];

const finalizedMatch = {
  groupId: GROUP_A.id,
  teamAId: 'alfa',
  teamBId: 'beta',
  resultType: MatchResultType.PLAYED,
  scoreA: 2,
  scoreB: 0,
  winnerId: 'alfa',
};

function createFixture(): {
  service: StandingService;
  groupService: Record<'listByCategory' | 'findByIdOrFail', jest.Mock>;
  matchService: Record<'listByCategory', jest.Mock>;
  teamService: Record<'listByCategory', jest.Mock>;
} {
  const groupService = {
    listByCategory: jest.fn().mockResolvedValue([GROUP_A, GROUP_B]),
    findByIdOrFail: jest.fn().mockResolvedValue(GROUP_A),
  };
  const teamService = { listByCategory: jest.fn().mockResolvedValue(teams) };
  const matchService = { listByCategory: jest.fn().mockResolvedValue([finalizedMatch]) };
  const service = new StandingService(
    groupService as unknown as MatchGroupService,
    teamService as unknown as TeamService,
    matchService as unknown as MatchService,
  );
  return { service, groupService, matchService, teamService };
}

describe('StandingService.listByCategory', () => {
  it('builds one table per group with only its teams and matches', async () => {
    const { service } = createFixture();

    const standings = await service.listByCategory(CATEGORY);

    expect(standings.map((group) => group.groupName)).toEqual(['Grupo A', 'Grupo B']);
    expect(standings[0]?.rows.map((row) => [row.teamName, row.points])).toEqual([
      ['Alfa', 3],
      ['Beta', 0],
    ]);
    expect(standings[1]?.rows.map((row) => [row.teamName, row.played])).toEqual([['Gama', 0]]);
  });

  it('counts only finalized matches of the group stage (RN-16)', async () => {
    const { service, matchService } = createFixture();

    await service.listByCategory(CATEGORY);

    expect(matchService.listByCategory).toHaveBeenCalledWith(CATEGORY, {
      stage: MatchStage.GROUP,
      status: MatchStatus.FINALIZED,
    });
  });

  it('does not build standings for a category that does not exist', async () => {
    const { service, groupService, matchService } = createFixture();
    groupService.listByCategory.mockRejectedValue(new NotFoundException());

    await expect(service.listByCategory(CATEGORY)).rejects.toBeInstanceOf(NotFoundException);
    expect(matchService.listByCategory).not.toHaveBeenCalled();
  });
});

describe('StandingService.getByGroup', () => {
  it('returns the table of one group', async () => {
    const { service } = createFixture();

    const rows = await service.getByGroup(GROUP_A.id);

    expect(rows.map((row) => row.teamId)).toEqual(['alfa', 'beta']);
    expect(rows[0]).toMatchObject({ position: 1, goalDifference: 2 });
  });

  it('fails when the group does not exist', async () => {
    const { service, groupService } = createFixture();
    groupService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(service.getByGroup(GROUP_A.id)).rejects.toBeInstanceOf(NotFoundException);
  });
});
