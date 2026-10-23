import type { SubEventType } from '../enums/sub-event-type.enum';

export interface SubEventResponseDto {
  id: number;
  editionId: number;
  type: SubEventType;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string | null;
}
