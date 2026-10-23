import { toCategoryResponse } from '../../category/mappers/category-response.mapper';
import { toTeamResponse } from '../../team/mappers/team-response.mapper';
import type { MatchListItemDto } from '../dto/match-list-item.dto';
import type { MatchListEntry } from '../services/match-listing.service';
import { toMatchResponse } from './match-response.mapper';

export function toMatchListItem(entry: MatchListEntry): MatchListItemDto {
  return {
    ...toMatchResponse(entry.match),
    teamA: toTeamResponse(entry.teamA),
    teamB: toTeamResponse(entry.teamB),
    category: toCategoryResponse(entry.category),
  };
}
