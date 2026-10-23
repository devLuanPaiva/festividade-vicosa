import type { CategoryResponseDto } from '../../category/dto/category-response.dto';
import type { TeamResponseDto } from '../../team/dto/team-response.dto';
import type { MatchResponseDto } from './match-response.dto';

export interface MatchListItemDto extends MatchResponseDto {
  teamA: TeamResponseDto;
  teamB: TeamResponseDto;
  category: CategoryResponseDto;
}
