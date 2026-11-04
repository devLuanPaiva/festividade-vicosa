import { SubEventType } from '../enums/sub-event-type.enum';
import { subEventFolders } from './sub-event-folders.rule';

describe('subEventFolders', () => {
  it('names the folder after the event', () => {
    expect(subEventFolders(SubEventType.JOCEV_FUTSAL)).toEqual(['jocev-futsal']);
  });

  it('writes every event type as a valid folder name', () => {
    for (const type of Object.values(SubEventType)) {
      expect(subEventFolders(type)[0]).toMatch(/^[a-z]+(-[a-z]+)*$/);
    }
  });
});
