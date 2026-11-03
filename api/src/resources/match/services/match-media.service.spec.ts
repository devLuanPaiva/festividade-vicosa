import { MediaFolder } from '../../../storage/rules/media-key.rule';
import type { CategoryService } from '../../category/services/category.service';
import type { TeamService } from '../../team/services/team.service';
import { MatchMediaService } from './match-media.service';
import type { MatchService } from './match.service';

function createService(): MatchMediaService {
  const matches = {
    findByIdOrFail: jest.fn().mockResolvedValue({
      categoryId: 'category-1',
      teamAId: 'team-a',
      teamBId: 'team-b',
      scheduledAt: new Date('2026-12-09T19:30:00-03:00'),
    }),
  };
  const teams = {
    findByIdOrFail: jest.fn((id: string) =>
      Promise.resolve({ slug: id === 'team-a' ? 'centro' : 'acude' }),
    ),
  };
  const categories = { mediaFolderOf: jest.fn().mockResolvedValue('futsal-sub-15-masculino') };
  return new MatchMediaService(
    matches as unknown as MatchService,
    teams as unknown as TeamService,
    categories as unknown as CategoryService,
  );
}

describe('MatchMediaService.targetFor', () => {
  it('puts the photos of a game in a folder named after its teams, date and time', async () => {
    const target = await createService().targetFor('match-1', MediaFolder.MATCH_PHOTO);

    expect(target).toEqual({
      folder: MediaFolder.MATCH_PHOTO,
      segments: ['futsal-sub-15-masculino', 'centro-x-acude-2026-12-09-1930'],
    });
  });

  it('uses the same game folder for the best player photo', async () => {
    const target = await createService().targetFor('match-1', MediaFolder.BEST_PLAYER);

    expect(target.segments).toEqual(['futsal-sub-15-masculino', 'centro-x-acude-2026-12-09-1930']);
  });
});
