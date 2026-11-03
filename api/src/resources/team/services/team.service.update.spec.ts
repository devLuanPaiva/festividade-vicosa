import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import {
  GROUP_ID,
  OTHER_CATEGORY_ID,
  TEAM_ID,
  createFixture,
  stored,
} from './team.service.fixture';

function foreignKeyFailure(): QueryFailedError {
  return new QueryFailedError('DELETE', [], Object.assign(new Error('fk'), { code: '23503' }));
}

describe('TeamService.update', () => {
  it('moves the team to another group of the category', async () => {
    const { service, repository } = createFixture();

    await service.update(TEAM_ID, { groupId: GROUP_ID });

    expect(repository.update).toHaveBeenCalledWith(TEAM_ID, { groupId: GROUP_ID });
  });

  it('takes the team out of its group when the group is null', async () => {
    const { service, repository, matchGroupService } = createFixture();

    await service.update(TEAM_ID, { groupId: null });

    expect(matchGroupService.findByIdOrFail).not.toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalledWith(TEAM_ID, { groupId: null });
  });

  it('refuses moving the team to a group of another category', async () => {
    const { service, matchGroupService, repository } = createFixture();
    matchGroupService.findByIdOrFail.mockResolvedValue({
      id: GROUP_ID,
      categoryId: OTHER_CATEGORY_ID,
    });

    await expect(service.update(TEAM_ID, { groupId: GROUP_ID })).rejects.toMatchObject({
      response: { code: 'GROUP_NOT_IN_CATEGORY' },
    });
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('refuses renaming to a name already used in the category', async () => {
    const { service, repository } = createFixture();
    repository.findByCategoryAndName.mockResolvedValue({ ...stored, id: 'other' });

    await expect(service.update(TEAM_ID, { name: 'Norte' })).rejects.toMatchObject({
      response: { code: 'TEAM_NAME_TAKEN' },
    });
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('refuses changing to a slug already used in the category', async () => {
    const { service, repository } = createFixture();
    repository.findByCategoryAndSlug.mockResolvedValue({ ...stored, id: 'other' });

    await expect(service.update(TEAM_ID, { slug: 'norte' })).rejects.toMatchObject({
      response: { code: 'TEAM_SLUG_TAKEN', field: 'slug' },
    });
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('does not recheck the name or the slug when they did not change', async () => {
    const { service, repository } = createFixture();

    await service.update(TEAM_ID, { name: 'Centro', slug: 'centro', city: 'Aurora' });

    expect(repository.findByCategoryAndName).not.toHaveBeenCalled();
    expect(repository.findByCategoryAndSlug).not.toHaveBeenCalled();
    expect(repository.update).toHaveBeenCalled();
  });
});

describe('TeamService.remove', () => {
  it('deletes an existing team', async () => {
    const { service, repository } = createFixture();

    await service.remove(TEAM_ID);

    expect(repository.remove).toHaveBeenCalledWith(TEAM_ID);
  });

  it('explains that a team with matches cannot be deleted (RN-33)', async () => {
    const { service, repository } = createFixture();
    repository.remove.mockRejectedValue(foreignKeyFailure());

    const failure = service.remove(TEAM_ID);

    await expect(failure).rejects.toBeInstanceOf(ConflictException);
    await expect(failure).rejects.toMatchObject({
      response: { code: 'TEAM_HAS_MATCHES', field: 'id' },
    });
  });

  it('does not delete a team that does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(service.remove(TEAM_ID)).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.remove).not.toHaveBeenCalled();
  });
});
