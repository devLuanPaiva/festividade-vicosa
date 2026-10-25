import { QueryFailedError } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MatchStatus } from '../enums/match.enums';
import {
  CATEGORY_ID,
  MATCH_ID,
  TEAM_A,
  TEAM_C,
  createFixture,
  knockoutInput,
  stored,
} from './match.service.fixture';

describe('MatchService queries', () => {
  it('does not list the matches of a category that does not exist', async () => {
    const { service, categoryService, repository } = createFixture();
    categoryService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(service.listByCategory(CATEGORY_ID, {})).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findByCategory).not.toHaveBeenCalled();
  });

  it('throws not found with the id field when the match does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(service.findByIdOrFail(MATCH_ID)).rejects.toMatchObject({
      response: { code: 'MATCH_NOT_FOUND', field: 'id' },
    });
  });
});

describe('MatchService.create', () => {
  it('validates the fixture and creates a match with nulls for the optional fields', async () => {
    const { service, repository, validator } = createFixture();

    await service.create(CATEGORY_ID, knockoutInput);

    expect(validator.assertValid).toHaveBeenCalledWith(CATEGORY_ID, knockoutInput);
    expect(repository.create).toHaveBeenCalledWith({
      categoryId: CATEGORY_ID,
      stage: knockoutInput.stage,
      groupId: null,
      round: knockoutInput.round,
      bracketPosition: null,
      scheduledAt: new Date('2026-12-18T22:00:00.000Z'),
      location: null,
      teamAId: TEAM_A,
      teamBId: knockoutInput.teamBId,
    });
  });

  it('does not create a match with an invalid fixture', async () => {
    const { service, repository, validator } = createFixture();
    validator.assertValid.mockRejectedValue(new Error('invalid'));

    await expect(service.create(CATEGORY_ID, knockoutInput)).rejects.toThrow('invalid');
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe('MatchService.update', () => {
  it('changes the schedule and the location without revalidating the teams', async () => {
    const { service, repository, validator } = createFixture();

    await service.update(MATCH_ID, {
      scheduledAt: '2026-12-18T20:00:00-03:00',
      location: 'Ginásio',
    });

    expect(validator.assertValid).not.toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalledWith(MATCH_ID, {
      scheduledAt: new Date('2026-12-18T23:00:00.000Z'),
      location: 'Ginásio',
    });
  });

  it('clears the location when it is sent blank', async () => {
    const { service, repository } = createFixture();

    await service.update(MATCH_ID, { location: '   ' });

    expect(repository.update).toHaveBeenCalledWith(MATCH_ID, { location: null });
  });

  it('revalidates the whole fixture when a team changes', async () => {
    const { service, validator } = createFixture();

    await service.update(MATCH_ID, { teamBId: TEAM_C });

    expect(validator.assertValid).toHaveBeenCalledWith(CATEGORY_ID, {
      stage: stored.stage,
      groupId: stored.groupId,
      round: null,
      teamAId: TEAM_A,
      teamBId: TEAM_C,
    });
  });

  it('refuses changing the teams of a finalized match', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue({ ...stored, status: MatchStatus.FINALIZED });

    await expect(service.update(MATCH_ID, { teamAId: TEAM_C })).rejects.toMatchObject({
      response: { code: 'MATCH_ALREADY_FINALIZED' },
    });
    expect(repository.update).not.toHaveBeenCalled();
  });
});

describe('MatchService.remove', () => {
  it('does not delete a match that does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(service.remove(MATCH_ID)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.remove).not.toHaveBeenCalled();
  });

  it('keeps a match that still has photos and tells to delete the photos first', async () => {
    const { service, repository } = createFixture();
    const foreignKeyViolation = new QueryFailedError(
      'DELETE',
      [],
      Object.assign(new Error('violates foreign key'), { code: '23503' }),
    );
    repository.remove.mockRejectedValue(foreignKeyViolation);

    await expect(service.remove(MATCH_ID)).rejects.toMatchObject({
      response: { code: 'MATCH_HAS_PHOTOS', field: 'id' },
    });
  });
});
