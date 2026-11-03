import type { CategoryService } from '../../category/services/category.service';
import { MatchRound, MatchStage, MatchStatus } from '../enums/match.enums';
import type { MatchRepository } from '../repository/match.repository';
import type { MatchFixtureValidator } from './match-fixture-validator.service';
import { MatchService } from './match.service';

export const MATCH_ID = '00000000-0000-4000-8000-0000000000d1';
export const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
export const GROUP_ID = '00000000-0000-4000-8000-000000000001';
export const TEAM_A = '00000000-0000-4000-8000-0000000000a1';
export const TEAM_B = '00000000-0000-4000-8000-0000000000b2';
export const TEAM_C = '00000000-0000-4000-8000-0000000000c3';

export const stored = {
  id: MATCH_ID,
  categoryId: CATEGORY_ID,
  stage: MatchStage.GROUP,
  groupId: GROUP_ID,
  round: null,
  status: MatchStatus.SCHEDULED,
  teamAId: TEAM_A,
  teamBId: TEAM_B,
};

export const knockoutInput = {
  stage: MatchStage.KNOCKOUT,
  round: MatchRound.SEMI_FINAL,
  scheduledAt: '2026-12-18T19:00:00-03:00',
  teamAId: TEAM_A,
  teamBId: TEAM_B,
};

export type RepositoryMock = Record<
  'findByCategory' | 'findById' | 'create' | 'update' | 'saveResult' | 'remove',
  jest.Mock
>;

export function createRepositoryMock(): RepositoryMock {
  return {
    findByCategory: jest.fn().mockResolvedValue([stored]),
    findById: jest.fn().mockResolvedValue(stored),
    create: jest.fn((record: object) => Promise.resolve({ id: MATCH_ID, ...record })),
    update: jest.fn().mockResolvedValue(undefined),
    saveResult: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined),
  };
}

export function createFixture(): {
  service: MatchService;
  repository: RepositoryMock;
  categoryService: Record<'findByIdOrFail', jest.Mock>;
  validator: Record<'assertValid', jest.Mock>;
} {
  const repository = createRepositoryMock();
  const categoryService = { findByIdOrFail: jest.fn().mockResolvedValue({ id: CATEGORY_ID }) };
  const validator = { assertValid: jest.fn().mockResolvedValue(undefined) };
  const service = new MatchService(
    repository as unknown as MatchRepository,
    categoryService as unknown as CategoryService,
    validator as unknown as MatchFixtureValidator,
  );
  return { service, repository, categoryService, validator };
}
