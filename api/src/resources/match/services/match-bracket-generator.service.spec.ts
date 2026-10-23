import { BadRequestException, ConflictException } from '@nestjs/common';
import type { CategoryService } from '../../category/services/category.service';
import { MatchRound, MatchStage } from '../enums/match.enums';
import type { MatchRepository } from '../repository/match.repository';
import type { MatchFixtureValidator } from './match-fixture-validator.service';
import { MatchBracketGenerator } from './match-bracket-generator.service';

const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const SCHEDULED_AT = '2026-12-18T19:00:00-03:00';

function teamIds(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `team-${index + 1}`);
}

function createGenerator(existing: object[] = []): {
  generator: MatchBracketGenerator;
  repository: Record<'findByCategory' | 'createMany', jest.Mock>;
  validator: Record<'assertValid', jest.Mock>;
} {
  const repository = {
    findByCategory: jest.fn().mockResolvedValue(existing),
    createMany: jest.fn((records: object[]) => Promise.resolve(records)),
  };
  const validator = { assertValid: jest.fn().mockResolvedValue(undefined) };
  const categoryService = { findByIdOrFail: jest.fn().mockResolvedValue({ id: CATEGORY_ID }) };
  const generator = new MatchBracketGenerator(
    repository as unknown as MatchRepository,
    categoryService as unknown as CategoryService,
    validator as unknown as MatchFixtureValidator,
  );
  return { generator, repository, validator };
}

describe('MatchBracketGenerator.generate', () => {
  it('creates the first round pairing the best seeds with the worst', async () => {
    const { generator, repository } = createGenerator();

    await generator.generate(CATEGORY_ID, {
      teamIds: teamIds(4),
      scheduledAt: SCHEDULED_AT,
      location: 'Ginásio',
    });

    expect(repository.createMany).toHaveBeenCalledWith([
      expect.objectContaining({
        round: MatchRound.SEMI_FINAL,
        stage: MatchStage.KNOCKOUT,
        bracketPosition: 0,
        teamAId: 'team-1',
        teamBId: 'team-4',
        location: 'Ginásio',
        groupId: null,
        scheduledAt: new Date('2026-12-18T22:00:00.000Z'),
      }),
      expect.objectContaining({ bracketPosition: 1, teamAId: 'team-2', teamBId: 'team-3' }),
    ]);
  });

  it('starts at the round that fits the number of teams', async () => {
    const { generator, repository } = createGenerator();

    await generator.generate(CATEGORY_ID, { teamIds: teamIds(8), scheduledAt: SCHEDULED_AT });

    const [records] = repository.createMany.mock.calls[0] as [{ round: MatchRound }[]];
    expect(records).toHaveLength(4);
    expect(records.every((record) => record.round === MatchRound.QUARTER_FINAL)).toBe(true);
  });

  it('validates that every pairing is made of teams of the category', async () => {
    const { generator, validator } = createGenerator();

    await generator.generate(CATEGORY_ID, { teamIds: teamIds(4), scheduledAt: SCHEDULED_AT });

    expect(validator.assertValid).toHaveBeenCalledTimes(2);
    expect(validator.assertValid).toHaveBeenCalledWith(CATEGORY_ID, {
      stage: MatchStage.KNOCKOUT,
      round: MatchRound.SEMI_FINAL,
      teamAId: 'team-1',
      teamBId: 'team-4',
    });
  });

  it('refuses a number of teams that does not fill a bracket', async () => {
    const { generator, repository } = createGenerator();

    await expect(
      generator.generate(CATEGORY_ID, { teamIds: teamIds(6), scheduledAt: SCHEDULED_AT }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.createMany).not.toHaveBeenCalled();
  });

  it('refuses to generate a second bracket for the category', async () => {
    const { generator, repository } = createGenerator([{ bracketPosition: 0 }]);

    await expect(
      generator.generate(CATEGORY_ID, { teamIds: teamIds(4), scheduledAt: SCHEDULED_AT }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repository.createMany).not.toHaveBeenCalled();
  });

  it('allows a bracket when the category only has hand-made knockout matches', async () => {
    const { generator, repository } = createGenerator([{ bracketPosition: null }]);

    await generator.generate(CATEGORY_ID, { teamIds: teamIds(2), scheduledAt: SCHEDULED_AT });

    expect(repository.createMany).toHaveBeenCalledTimes(1);
  });

  it('creates nothing when a team does not belong to the category', async () => {
    const { generator, repository, validator } = createGenerator();
    validator.assertValid.mockRejectedValueOnce(new BadRequestException());

    await expect(
      generator.generate(CATEGORY_ID, { teamIds: teamIds(4), scheduledAt: SCHEDULED_AT }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.createMany).not.toHaveBeenCalled();
  });
});
