import type { MatchService } from '../../match/services/match.service';
import type { SubEventService } from '../../sub-event/services/sub-event.service';
import type { AlbumRepository } from '../repository/album.repository';
import { AlbumService } from './album.service';

const SUB_EVENT_ID = '00000000-0000-4000-8000-0000000000e1';

function createFixture(): { service: AlbumService; repository: { ensureForEventDay: jest.Mock } } {
  const repository = { ensureForEventDay: jest.fn().mockResolvedValue({ id: 'album-day' }) };
  const subEvents = {
    findByIdOrFail: jest.fn().mockResolvedValue({ startDate: '2026-12-09', endDate: '2026-12-19' }),
  };
  const service = new AlbumService(
    repository as unknown as AlbumRepository,
    subEvents as unknown as SubEventService,
    {} as unknown as MatchService,
  );
  return { service, repository };
}

describe('AlbumService.ensureForEventDay', () => {
  it.each(['2026-12-09', '2026-12-14', '2026-12-19'])(
    'opens the album of %s, a day of the sub-event',
    async (day) => {
      const { service, repository } = createFixture();

      await service.ensureForEventDay(SUB_EVENT_ID, day);

      expect(repository.ensureForEventDay).toHaveBeenCalledWith(SUB_EVENT_ID, day);
    },
  );

  it.each(['2026-12-08', '2026-12-20'])(
    'refuses %s, a day outside the sub-event, without creating an album',
    async (day) => {
      const { service, repository } = createFixture();

      await expect(service.ensureForEventDay(SUB_EVENT_ID, day)).rejects.toMatchObject({
        response: { code: 'DAY_OUTSIDE_SUB_EVENT', field: 'date' },
      });
      expect(repository.ensureForEventDay).not.toHaveBeenCalled();
    },
  );
});
