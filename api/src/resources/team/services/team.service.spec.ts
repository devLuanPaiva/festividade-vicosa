import { NotFoundException } from '@nestjs/common';
import {
  CATEGORY_ID,
  GROUP_ID,
  OTHER_CATEGORY_ID,
  createFixture,
  newTeam,
  stored,
} from './team.service.fixture';

describe('TeamService queries', () => {
  it('does not list the teams of a category that does not exist', async () => {
    const { service, categoryService, repository } = createFixture();
    categoryService.findByIdOrFail.mockRejectedValue(new NotFoundException());

    await expect(service.listByCategory(CATEGORY_ID, {})).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.findByCategory).not.toHaveBeenCalled();
  });

  it('throws not found with the id field when the team does not exist', async () => {
    const { service, repository } = createFixture();
    repository.findById.mockResolvedValue(null);

    await expect(service.findByIdOrFail(stored.id)).rejects.toMatchObject({
      response: { code: 'TEAM_NOT_FOUND', field: 'id' },
    });
  });
});

describe('TeamService.create', () => {
  it('creates a team deriving the slug from the name and nulling the optional fields', async () => {
    const { service, repository } = createFixture();

    await service.create(CATEGORY_ID, newTeam);

    expect(repository.create).toHaveBeenCalledWith({
      categoryId: CATEGORY_ID,
      groupId: null,
      name: 'Bairro Açude',
      slug: 'bairro-acude',
      city: 'Viçosa',
      abbreviation: null,
      photoKey: null,
    });
  });

  it('keeps the slug, abbreviation and photo when they are given', async () => {
    const { service, repository } = createFixture();

    await service.create(CATEGORY_ID, {
      ...newTeam,
      slug: 'acude',
      abbreviation: 'ACU',
      photoKey: 'photos/1',
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ slug: 'acude', abbreviation: 'ACU', photoKey: 'photos/1' }),
    );
  });

  it('creates a team inside a group of the same category (RN-13)', async () => {
    const { service, repository } = createFixture();

    await service.create(CATEGORY_ID, { ...newTeam, groupId: GROUP_ID });

    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ groupId: GROUP_ID }));
  });

  it('refuses a group of another category pointing at the group field', async () => {
    const { service, matchGroupService, repository } = createFixture();
    matchGroupService.findByIdOrFail.mockResolvedValue({
      id: GROUP_ID,
      categoryId: OTHER_CATEGORY_ID,
    });

    await expect(
      service.create(CATEGORY_ID, { ...newTeam, groupId: GROUP_ID }),
    ).rejects.toMatchObject({
      response: { code: 'GROUP_NOT_IN_CATEGORY', field: 'groupId' },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('refuses a repeated name inside the category', async () => {
    const { service, repository } = createFixture();
    repository.findByCategoryAndName.mockResolvedValue(stored);

    await expect(service.create(CATEGORY_ID, newTeam)).rejects.toMatchObject({
      response: { code: 'TEAM_NAME_TAKEN', field: 'name' },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('refuses a repeated slug inside the category', async () => {
    const { service, repository } = createFixture();
    repository.findByCategoryAndSlug.mockResolvedValue(stored);

    await expect(service.create(CATEGORY_ID, newTeam)).rejects.toMatchObject({
      response: { code: 'TEAM_SLUG_TAKEN', field: 'slug' },
    });
    expect(repository.create).not.toHaveBeenCalled();
  });
});
