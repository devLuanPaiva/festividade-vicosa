import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import type { BracketMatchSuggestionDto, FixtureSuggestionDto } from '../dto/match-suggestion.dto';
import { SuggestBracketDto } from '../dto/suggest-bracket.dto';
import { BracketSuggestionService } from '../services/bracket-suggestion.service';
import { GroupFixtureSuggestionService } from '../services/group-fixture-suggestion.service';

@Controller()
export class MatchSuggestionController {
  public constructor(
    private readonly groupFixtures: GroupFixtureSuggestionService,
    private readonly bracket: BracketSuggestionService,
  ) {}

  @Get('groups/:groupId/fixture-suggestions')
  @RequirePermission(Permission.MATCH_CREATE)
  public suggestGroupFixtures(
    @Param('groupId', ParseIdPipe) groupId: string,
  ): Promise<FixtureSuggestionDto[]> {
    return this.groupFixtures.suggest(groupId);
  }

  @Post('categories/:categoryId/bracket/suggestion')
  @RequirePermission(Permission.MATCH_CREATE)
  public suggestFirstRound(
    @Param('categoryId', ParseIdPipe) categoryId: string,
    @Body() input: SuggestBracketDto,
  ): Promise<BracketMatchSuggestionDto[]> {
    return this.bracket.suggestFirstRound(categoryId, input.teamIds);
  }

  @Get('categories/:categoryId/bracket/next-matches')
  @RequirePermission(Permission.MATCH_CREATE)
  public suggestNextMatches(
    @Param('categoryId', ParseIdPipe) categoryId: string,
  ): Promise<BracketMatchSuggestionDto[]> {
    return this.bracket.suggestNextMatches(categoryId);
  }
}
