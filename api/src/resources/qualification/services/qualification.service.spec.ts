import { BadRequestException } from '@nestjs/common';
import type { MatchGroupService } from '../../match-group/services/match-group.service';
import type { TeamService } from '../../team/services/team.service';
import type { QualifiedTeamRepository } from '../repository/qualified-team.repository';
import { QualificationService } from './qualification.service';

const GROUP_ID = '00000000-0000-4000-8000-000000000001';
const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';

function createService(): {
  service: QualificationService;
  repository: Record<'findByGroups' | 'replaceForGroup', jest.Mock>;
  teamService: Record<'listByCategory', jest.Mock>;
} {
  const repository = {
    findByGroups: jest.fn().mockResolvedValue([]),
    replaceForGroup: jest.fn().mockResolvedValue([]),
  };
  const matchGroupService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ id: GROUP_ID, categoryId: CATEGORY_ID }),
  };
  const teamService = {
    listByCategory: jest.fn().mockResolvedValue([{ id: 'alfa' }, { id: 'beta' }, { id: 'gama' }]),
  };
  const service = new QualificationService(
    repository as unknown as QualifiedTeamRepository,
    matchGroupService as unknown as MatchGroupService,
    teamService as unknown as TeamService,
  );
  return { service, repository, teamService };
}

describe('QualificationService.confirm', () => {
  it('stores the teams in the confirmed order, starting at position 1', async () => {
    const { service, repository, teamService } = createService();

    await service.confirm(GROUP_ID, ['gama', 'alfa']);

    expect(teamService.listByCategory).toHaveBeenCalledWith(CATEGORY_ID, { groupId: GROUP_ID });
    expect(repository.replaceForGroup).toHaveBeenCalledWith(GROUP_ID, [
      { teamId: 'gama', position: 1 },
      { teamId: 'alfa', position: 2 },
    ]);
  });

  it.each([[['alfa', 'alfa']], [['alfa', 'delta']]])('refuses %j', async (teamIds) => {
    const { service, repository } = createService();

    await expect(service.confirm(GROUP_ID, teamIds)).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.replaceForGroup).not.toHaveBeenCalled();
  });
});
