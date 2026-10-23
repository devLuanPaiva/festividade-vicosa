import type { SubEventResponseDto } from '../dto/sub-event-response.dto';
import type { SubEvent } from '../entities/sub-event.entity';

export function toSubEventResponse(subEvent: SubEvent): SubEventResponseDto {
  return {
    id: subEvent.id,
    editionId: subEvent.editionId,
    type: subEvent.type,
    name: subEvent.name,
    description: subEvent.description,
    startDate: subEvent.startDate,
    endDate: subEvent.endDate,
    location: subEvent.location,
  };
}
