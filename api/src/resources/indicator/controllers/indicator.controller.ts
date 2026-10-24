import { Controller, Get } from '@nestjs/common';
import type {
  CategoryProgressResponseDto,
  MatchesByDayResponseDto,
  OverviewResponseDto,
  RecentResultResponseDto,
} from '../dto/indicator-response.dto';
import { IndicatorService } from '../services/indicator.service';

@Controller('indicators')
export class IndicatorController {
  public constructor(private readonly indicatorService: IndicatorService) {}

  @Get('overview')
  public getOverview(): Promise<OverviewResponseDto> {
    return this.indicatorService.getOverview();
  }

  @Get('matches-by-day')
  public listMatchesByDay(): Promise<MatchesByDayResponseDto[]> {
    return this.indicatorService.listMatchesByDay();
  }

  @Get('categories-progress')
  public listCategoryProgress(): Promise<CategoryProgressResponseDto[]> {
    return this.indicatorService.listCategoryProgress();
  }

  @Get('recent-results')
  public listRecentResults(): Promise<RecentResultResponseDto[]> {
    return this.indicatorService.listRecentResults();
  }
}
