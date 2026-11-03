import { type EntityManager, type Repository } from 'typeorm';
import { QualifiedTeam } from '../entities/qualified-team.entity';
import { QualifiedTeamRepository } from './qualified-team.repository';

const GROUP_ID = '00000000-0000-4000-8000-000000000001';
const TEAM_A = '00000000-0000-4000-8000-0000000000a1';
const TEAM_B = '00000000-0000-4000-8000-0000000000b2';

function createFixture(): {
  repository: QualifiedTeamRepository;
  typeorm: Record<'find', jest.Mock>;
  manager: Record<'delete' | 'create' | 'save', jest.Mock>;
} {
  const manager = {
    delete: jest.fn().mockResolvedValue(undefined),
    create: jest.fn((_: unknown, entity: object) => entity),
    save: jest.fn((_: unknown, entities: object[]) => Promise.resolve(entities)),
  };
  const typeorm = {
    find: jest.fn(),
    manager: {
      transaction: <Result>(
        work: (entityManager: EntityManager) => Promise<Result>,
      ): Promise<Result> => work(manager as unknown as EntityManager),
    },
  };
  return {
    repository: new QualifiedTeamRepository(typeorm as unknown as Repository<QualifiedTeam>),
    typeorm,
    manager,
  };
}

describe('QualifiedTeamRepository', () => {
  it('replaces the qualified teams of a group inside one transaction', async () => {
    const { repository, manager } = createFixture();

    const saved = await repository.replaceForGroup(GROUP_ID, [
      { teamId: TEAM_B, position: 1 },
      { teamId: TEAM_A, position: 2 },
    ]);

    expect(manager.delete).toHaveBeenCalledWith(QualifiedTeam, { groupId: GROUP_ID });
    expect(saved).toEqual([
      { groupId: GROUP_ID, teamId: TEAM_B, position: 1 },
      { groupId: GROUP_ID, teamId: TEAM_A, position: 2 },
    ]);
  });
});
