import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../../auth/decorators/decorators';
import { ListAllMatchesQueryDto } from '../dto/list-all-matches-query.dto';
import type { MatchListItemDto } from '../dto/match-list-item.dto';
import { toMatchListItem } from '../mappers/match-list-item.mapper';
import { MatchListingService } from '../services/match-listing.service';

@Controller('matches')
export class MatchListingController {
  public constructor(private readonly matchListingService: MatchListingService) {}

  @Public()
  @Get()
  public async list(@Query() filters: ListAllMatchesQueryDto): Promise<MatchListItemDto[]> {
    return (await this.matchListingService.list(filters)).map(toMatchListItem);
  }
}
