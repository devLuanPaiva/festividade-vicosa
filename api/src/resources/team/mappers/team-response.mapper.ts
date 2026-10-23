import type { TeamResponseDto } from '../dto/team-response.dto';
import type { Team } from '../entities/team.entity';

export function toTeamResponse(team: Team): TeamResponseDto {
  return {
    id: team.id,
    categoryId: team.categoryId,
    groupId: team.groupId,
    name: team.name,
    slug: team.slug,
    city: team.city,
    abbreviation: team.abbreviation,
    photoKey: team.photoKey,
  };
}
