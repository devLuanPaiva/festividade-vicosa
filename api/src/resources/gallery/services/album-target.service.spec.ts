import type { MatchMediaService } from '../../match/services/match-media.service';
import type { SubEventService } from '../../sub-event/services/sub-event.service';
import { AlbumTargetService } from './album-target.service';

const SUB_EVENT_ID = '00000000-0000-4000-8000-0000000000e1';

function createService(): AlbumTargetService {
  const subEvents = {
    findByIdOrFail: jest.fn().mockResolvedValue({
      type: 'JOCEV_FUTSAL',
      startDate: '2026-12-09',
      endDate: '2026-12-19',
    }),
  };
  return new AlbumTargetService(
    subEvents as unknown as SubEventService,
    {} as unknown as MatchMediaService,
  );
}

describe('AlbumTargetService.forEventDay', () => {
  it.each(['2026-12-09', '2026-12-14', '2026-12-19'])(
    'puts the photos of %s in a folder of the event and the day',
    async (day) => {
      await expect(createService().forEventDay(SUB_EVENT_ID, day)).resolves.toEqual({
        folder: 'EVENT_PHOTO',
        segments: ['jocev-futsal', day],
      });
    },
  );

  it.each(['2026-12-08', '2026-12-20'])('refuses %s, a day outside the sub-event', async (day) => {
    await expect(createService().forEventDay(SUB_EVENT_ID, day)).rejects.toMatchObject({
      response: { code: 'DAY_OUTSIDE_SUB_EVENT', field: 'date' },
    });
  });
});
