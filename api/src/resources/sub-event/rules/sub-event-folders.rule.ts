import { slugify } from '../../../common/text/slugify';
import type { SubEventType } from '../enums/sub-event-type.enum';

export function subEventFolders(type: SubEventType): string[] {
  return [slugify(type)];
}
