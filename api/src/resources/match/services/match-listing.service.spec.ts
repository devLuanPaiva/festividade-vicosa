import type { CategoryService } from '../../category/services/category.service';
import type { TeamService } from '../../team/services/team.service';
import type { MatchSearchRepository } from '../repository/match-search.repository';
import { MatchListingService } from './match-listing.service';

const CATEGORY_ID = '00000000-0000-4000-8000-000000000005';
const TEAM_A = '00000000-0000-4000-8000-0000000000a1';
const TEAM_B = '00000000-0000-4000-8000-0000000000b2';
const NOW = new Date('2026-12-09T12:00:00-03:00');

const match = { id: 'match-1', categoryId: CATEGORY_ID, teamAId: TEAM_A, teamBId: TEAM_B };
const CRITERIA = { scope: {}, descending: false, offset: 0, limit: 25 };

function createService(): { service: MatchListingService; listTeams: jest.Mock } {
  const listTeams = jest.fn().mockResolvedValue([{ id: TEAM_A }, { id: TEAM_B }]);
  const service = new MatchListingService(
    {
      search: jest.fn().mockResolvedValue({ matches: [match], total: 87 }),
    } as unknown as MatchSearchRepository,
    { listByIds: jest.fn().mockResolvedValue([{ id: CATEGORY_ID }]) } as unknown as CategoryService,
    { listByIds: listTeams } as unknown as TeamService,
  );
  return { service, listTeams };
}

describe('MatchListingService', () => {
  it('attaches teams and category to the page and keeps the total of the whole search', async () => {
    const { service } = createService();

    const { entries, total } = await service.list(CRITERIA, NOW);

    expect(total).toBe(87);
    expect(entries[0]).toMatchObject({
      match,
      teamA: { id: TEAM_A },
      teamB: { id: TEAM_B },
      category: { id: CATEGORY_ID },
    });
  });

  it('fails loudly when a match points to a team that no longer exists', async () => {
    const { service, listTeams } = createService();
    listTeams.mockResolvedValue([{ id: TEAM_A }]);

    await expect(service.list(CRITERIA, NOW)).rejects.toThrow(TEAM_B);
  });
});
