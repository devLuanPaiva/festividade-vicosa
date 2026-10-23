import type { MatchGroupResponseDto } from '../dto/match-group-response.dto';
import type { MatchGroup } from '../entities/match-group.entity';

export function toMatchGroupResponse(group: MatchGroup): MatchGroupResponseDto {
  return { id: group.id, categoryId: group.categoryId, name: group.name };
}
