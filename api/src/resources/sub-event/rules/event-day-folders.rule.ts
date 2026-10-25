import { slugify } from '../../../common/text/slugify';
import type { SubEventType } from '../enums/sub-event-type.enum';

export function eventDayFolders(type: SubEventType, day: string): string[] {
  return [slugify(type), day];
}
