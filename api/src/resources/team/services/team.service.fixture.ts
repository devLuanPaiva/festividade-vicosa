import type { CategoryService } from '../../category/services/category.service';
import type { MatchGroupService } from '../../match-group/services/match-group.service';
import type { TeamRepository } from '../repository/team.repository';
import { TeamService } from './team.service';

export type RepositoryMock = Record<
  | 'findByCategory'
  | 'findById'
  | 'findByCategoryAndName'
  | 'findByCategoryAndSlug'
  | 'create'
  | 'update'
  | 'remove',
  jest.Mock
>;

export const TEAM_ID = '00000000-0000-4000-8000-000000000007';
export const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
export const OTHER_CATEGORY_ID = '00000000-0000-4000-8000-000000000006';
export const GROUP_ID = '00000000-0000-4000-8000-000000000001';

export const stored = {
  id: TEAM_ID,
  categoryId: CATEGORY_ID,
  groupId: null,
  name: 'Centro',
  slug: 'centro',
  city: 'Viçosa',
  abbreviation: null,
  photoKey: null,
};

export const newTeam = { name: 'Bairro Açude', city: 'Viçosa' };

function createRepositoryMock(): RepositoryMock {
  return {
    findByCategory: jest.fn().mockResolvedValue([stored]),
    findById: jest.fn().mockResolvedValue(stored),
    findByCategoryAndName: jest.fn().mockResolvedValue(null),
    findByCategoryAndSlug: jest.fn().mockResolvedValue(null),
    create: jest.fn((record: object) => Promise.resolve({ id: TEAM_ID, ...record })),
    update: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };
}

export function createFixture(): {
  service: TeamService;
  repository: RepositoryMock;
  categoryService: Record<'findByIdOrFail', jest.Mock>;
  matchGroupService: Record<'findByIdOrFail', jest.Mock>;
} {
  const repository = createRepositoryMock();
  const categoryService = { findByIdOrFail: jest.fn().mockResolvedValue({ id: CATEGORY_ID }) };
  const matchGroupService = {
    findByIdOrFail: jest.fn().mockResolvedValue({ id: GROUP_ID, categoryId: CATEGORY_ID }),
  };
  const service = new TeamService(
    repository as unknown as TeamRepository,
    categoryService as unknown as CategoryService,
    matchGroupService as unknown as MatchGroupService,
  );
  return { service, repository, categoryService, matchGroupService };
}
