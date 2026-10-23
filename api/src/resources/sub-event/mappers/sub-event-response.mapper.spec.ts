import { SubEventType } from '../enums/sub-event-type.enum';
import type { SubEvent } from '../entities/sub-event.entity';
import { toSubEventResponse } from './sub-event-response.mapper';

describe('toSubEventResponse', () => {
  it('exposes every public field of the sub-event', () => {
    const subEvent: SubEvent = {
      id: 3,
      editionId: 1,
      type: SubEventType.JOCEV_FUTSAL,
      name: 'JOCEV - Futsal',
      description: null,
      startDate: '2026-12-09',
      endDate: '2026-12-19',
      location: 'Ginásio',
    };

    expect(toSubEventResponse(subEvent)).toEqual(subEvent);
  });
});
