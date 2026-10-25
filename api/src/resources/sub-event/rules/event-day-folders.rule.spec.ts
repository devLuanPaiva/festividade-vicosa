import { SubEventType } from '../enums/sub-event-type.enum';
import { eventDayFolders } from './event-day-folders.rule';

describe('eventDayFolders', () => {
  it('puts the day inside a folder named after the event', () => {
    expect(eventDayFolders(SubEventType.JOCEV_FUTSAL, '2026-12-13')).toEqual([
      'jocev-futsal',
      '2026-12-13',
    ]);
  });

  it('writes every event type as a valid folder name', () => {
    for (const type of Object.values(SubEventType)) {
      expect(eventDayFolders(type, '2026-12-13')[0]).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });
});
