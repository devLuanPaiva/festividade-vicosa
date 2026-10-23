import type { CategoryService } from '../../category/services/category.service';
import type { TeamService } from '../../team/services/team.service';
import type { MatchRepository } from '../repository/match.repository';
import { MatchListingService } from './match-listing.service';

const SUB_EVENT_ID = '00000000-0000-4000-8000-0000000000e1';
const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const OTHER_CATEGORY_ID = '00000000-0000-4000-8000-000000000006';
const TEAM_A = '00000000-0000-4000-8000-0000000000a1';
const TEAM_B = '00000000-0000-4000-8000-0000000000b2';

const match = { id: 'match-1', categoryId: CATEGORY_ID, teamAId: TEAM_A, teamBId: TEAM_B };

function createService(): {
  service: MatchListingService;
  findInCategories: jest.Mock;
  listBySubEvent: jest.Mock;
  listTeams: jest.Mock;
} {
  const findInCategories = jest.fn().mockResolvedValue([match]);
  const listBySubEvent = jest
    .fn()
    .mockResolvedValue([{ id: CATEGORY_ID }, { id: OTHER_CATEGORY_ID }]);
  const listTeams = jest.fn().mockResolvedValue([{ id: TEAM_A }, { id: TEAM_B }]);
  const categoryService = {
    listBySubEvent,
    findByIdOrFail: jest.fn().mockResolvedValue({ id: CATEGORY_ID }),
    listByIds: jest.fn().mockResolvedValue([{ id: CATEGORY_ID }]),
  };
  const service = new MatchListingService(
    { findInCategories } as unknown as MatchRepository,
    categoryService as unknown as CategoryService,
    { listByIds: listTeams } as unknown as TeamService,
  );
  return { service, findInCategories, listBySubEvent, listTeams };
}

describe('MatchListingService', () => {
  it('lists every category when no scope is given and attaches teams and category', async () => {
    const { service, findInCategories } = createService();

    const [entry] = await service.list({});

    expect(findInCategories).toHaveBeenCalledWith(undefined, {});
    expect(entry).toMatchObject({
      match,
      teamA: { id: TEAM_A },
      teamB: { id: TEAM_B },
      category: { id: CATEGORY_ID },
    });
  });

  it('limits the listing to the categories of the sub-event', async () => {
    const { service, findInCategories } = createService();

    await service.list({ subEventId: SUB_EVENT_ID, status: undefined });

    expect(findInCategories).toHaveBeenCalledWith([CATEGORY_ID, OTHER_CATEGORY_ID], {
      status: undefined,
    });
  });

  it('returns nothing when the category does not belong to the sub-event', async () => {
    const { service, findInCategories } = createService();
    const foreignCategory = '00000000-0000-4000-8000-0000000000ff';

    const entries = await service.list({ subEventId: SUB_EVENT_ID, categoryId: foreignCategory });

    expect(entries).toEqual([]);
    expect(findInCategories).not.toHaveBeenCalled();
  });

  it('fails loudly when a match points to a team that no longer exists', async () => {
    const { service, listTeams } = createService();
    listTeams.mockResolvedValue([{ id: TEAM_A }]);

    await expect(service.list({})).rejects.toThrow(TEAM_B);
  });
});
