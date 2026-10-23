import { SubEventType } from '../../sub-event/enums/sub-event-type.enum';

const CHAMPIONSHIP_SUB_EVENT_TYPES: readonly SubEventType[] = [
  SubEventType.JOCEV_HANDBALL,
  SubEventType.JOCEV_FUTSAL,
];

export function hasChampionship(type: SubEventType): boolean {
  return CHAMPIONSHIP_SUB_EVENT_TYPES.includes(type);
}
