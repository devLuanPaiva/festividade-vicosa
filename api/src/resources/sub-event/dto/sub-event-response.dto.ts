import type { SubEventType } from '../enums/sub-event-type.enum';

export interface SubEventResponseDto {
  id: string;
  editionId: string;
  type: SubEventType;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string | null;
}
