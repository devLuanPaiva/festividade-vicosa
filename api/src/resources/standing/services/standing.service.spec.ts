import type { MatchGroupService } from '../../match-group/services/match-group.service';
import { MatchResultType, MatchStage, MatchStatus } from '../../match/enums/match.enums';
import type { MatchService } from '../../match/services/match.service';
import type { QualificationService } from '../../qualification/services/qualification.service';
import type { TeamService } from '../../team/services/team.service';
import { StandingDataLoader } from './standing-data.loader';
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
  qualificationService: Record<'listByGroups', jest.Mock>;
} {
  const groupService = {
    listByCategory: jest.fn().mockResolvedValue([GROUP_A, GROUP_B]),
    findByIdOrFail: jest.fn().mockResolvedValue(GROUP_A),
  };
  const teamService = { listByCategory: jest.fn().mockResolvedValue(teams) };
  const matchService = { listByCategory: jest.fn().mockResolvedValue([finalizedMatch]) };
  const qualificationService = { listByGroups: jest.fn().mockResolvedValue([]) };
  const dataLoader = new StandingDataLoader(
    teamService as unknown as TeamService,
    matchService as unknown as MatchService,
    qualificationService as unknown as QualificationService,
  );
  const service = new StandingService(groupService as unknown as MatchGroupService, dataLoader);
  return { service, groupService, matchService, teamService, qualificationService };
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
});

describe('StandingService qualified positions', () => {
  it('marks the teams the staff confirmed with their position in their own group', async () => {
    const { service, qualificationService } = createFixture();
    qualificationService.listByGroups.mockResolvedValue([
      { groupId: GROUP_A.id, teamId: 'beta', position: 1 },
    ]);

    const standings = await service.listByCategory(CATEGORY);

    expect(qualificationService.listByGroups).toHaveBeenCalledWith([GROUP_A.id, GROUP_B.id]);
    expect(standings[0]?.rows.map((row) => [row.teamId, row.qualifiedPosition])).toEqual([
      ['alfa', null],
      ['beta', 1],
    ]);
    expect(standings[1]?.rows[0]?.qualifiedPosition).toBeNull();
  });

  it('ignores a confirmation of a team that left the group', async () => {
    const { service, qualificationService } = createFixture();
    qualificationService.listByGroups.mockResolvedValue([
      { groupId: GROUP_B.id, teamId: 'alfa', position: 1 },
    ]);

    const standings = await service.listByCategory(CATEGORY);

    expect(standings[0]?.rows.every((row) => row.qualifiedPosition === null)).toBe(true);
  });
});

describe('StandingService.listSeeding', () => {
  it('seeds the confirmed teams of every group of the category', async () => {
    const { service, qualificationService } = createFixture();
    qualificationService.listByGroups.mockResolvedValue([
      { groupId: GROUP_A.id, teamId: 'beta', position: 1 },
      { groupId: GROUP_B.id, teamId: 'gama', position: 1 },
    ]);

    const seeding = await service.listSeeding(CATEGORY);

    expect(seeding.map((team) => [team.seed, team.teamName, team.groupName])).toEqual([
      [1, 'Gama', 'Grupo B'],
      [2, 'Beta', 'Grupo A'],
    ]);
  });
});

describe('StandingService.getByGroup', () => {
  it('returns the table of one group', async () => {
    const { service } = createFixture();

    const rows = await service.getByGroup(GROUP_A.id);

    expect(rows.map((row) => row.teamId)).toEqual(['alfa', 'beta']);
    expect(rows[0]).toMatchObject({ position: 1, goalDifference: 2 });
  });
});
