import { Controller, Get, Param } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { Public } from '../../auth/decorators/decorators';
import type {
  GroupStandingsResponseDto,
  SeededTeamResponseDto,
  StandingRowResponseDto,
} from '../dto/standing-response.dto';
import { StandingService } from '../services/standing.service';

@Controller()
export class StandingController {
  public constructor(private readonly standingService: StandingService) {}

  @Public()
  @Get('categories/:categoryId/standings')
  public listByCategory(
    @Param('categoryId', ParseIdPipe) categoryId: string,
  ): Promise<GroupStandingsResponseDto[]> {
    return this.standingService.listByCategory(categoryId);
  }

  @Public()
  @Get('categories/:categoryId/seeding')
  public listSeeding(
    @Param('categoryId', ParseIdPipe) categoryId: string,
  ): Promise<SeededTeamResponseDto[]> {
    return this.standingService.listSeeding(categoryId);
  }

  @Public()
  @Get('groups/:id/standings')
  public getByGroup(@Param('id', ParseIdPipe) id: string): Promise<StandingRowResponseDto[]> {
    return this.standingService.getByGroup(id);
  }
}
