import { Body, Controller, Param, Post } from '@nestjs/common';
import { ParseIdPipe } from '../../../common/pipes/parse-id.pipe';
import { RequirePermission } from '../../auth/decorators/decorators';
import { Permission } from '../../role/enums/permission.enum';
import { GenerateBracketDto } from '../dto/generate-bracket.dto';
import type { MatchResponseDto } from '../dto/match-response.dto';
import { toMatchResponse } from '../mappers/match-response.mapper';
import { MatchBracketGenerator } from '../services/match-bracket-generator.service';

@Controller()
export class MatchBracketController {
  public constructor(private readonly bracketGenerator: MatchBracketGenerator) {}

  @Post('categories/:categoryId/bracket')
  @RequirePermission(Permission.MATCH_CREATE)
  public async generate(
    @Param('categoryId', ParseIdPipe) categoryId: string,
    @Body() input: GenerateBracketDto,
  ): Promise<MatchResponseDto[]> {
    return (await this.bracketGenerator.generate(categoryId, input)).map(toMatchResponse);
  }
}
