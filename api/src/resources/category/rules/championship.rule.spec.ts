import { SubEventType } from '../../sub-event/enums/sub-event-type.enum';
import { hasChampionship } from './championship.rule';

describe('hasChampionship', () => {
  it.each([
    { type: SubEventType.JOCEV_HANDBALL, expected: true },
    { type: SubEventType.JOCEV_FUTSAL, expected: true },
    { type: SubEventType.JOCEV_BEACH_VOLLEYBALL, expected: false },
    { type: SubEventType.ECOPEDAL, expected: false },
  ])('returns $expected for $type (RN-03)', ({ type, expected }) => {
    expect(hasChampionship(type)).toBe(expected);
  });
});
