import { Controller, Get, Query } from '@nestjs/common';
import { DEFAULT_PAGE_LIMIT } from '../../../interceptors/pagination';
import { Public } from '../../auth/decorators/decorators';
import { ListAllMatchesQueryDto } from '../dto/list-all-matches-query.dto';
import type { MatchListItemDto } from '../dto/match-list-item.dto';
import { toMatchListItem } from '../mappers/match-list-item.mapper';
import type { MatchScope, MatchSearchCriteria } from '../repository/match-search.repository';
import type { SituationCounts } from '../rules/match-situation.rule';
import { MatchListingService } from '../services/match-listing.service';

interface MatchListPageDto {
  results: MatchListItemDto[];
  count: number;
}

function toScope(query: ListAllMatchesQueryDto): MatchScope {
  return {
    stage: query.stage,
    groupId: query.groupId,
    round: query.round,
    status: query.status,
    teamId: query.teamId,
    scheduledFrom: query.scheduledFrom,
    scheduledTo: query.scheduledTo,
    categoryId: query.categoryId,
    subEventId: query.subEventId,
    search: query.search,
    day: query.day,
  };
}

function toCriteria(query: ListAllMatchesQueryDto): MatchSearchCriteria {
  return {
    scope: toScope(query),
    situation: query.situation,
    descending: query.order === 'desc',
    offset: query.offset ?? 0,
    limit: query.limit ?? DEFAULT_PAGE_LIMIT,
  };
}

@Controller()
export class MatchListingController {
  public constructor(private readonly matchListingService: MatchListingService) {}

  @Public()
  @Get('matches')
  public async list(@Query() query: ListAllMatchesQueryDto): Promise<MatchListPageDto> {
    const page = await this.matchListingService.list(toCriteria(query), new Date());
    return { results: page.entries.map(toMatchListItem), count: page.total };
  }

  @Public()
  @Get('match-situations')
  public countSituations(@Query() query: ListAllMatchesQueryDto): Promise<SituationCounts> {
    return this.matchListingService.countSituations(toScope(query), new Date());
  }

  @Public()
  @Get('match-days')
  public listDays(@Query() query: ListAllMatchesQueryDto): Promise<string[]> {
    return this.matchListingService.listDays(toScope(query));
  }
}
