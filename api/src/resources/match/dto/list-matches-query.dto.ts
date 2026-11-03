import { IsEnum, IsISO8601, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/query/pagination-query.dto';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { MatchRound, MatchStage, MatchStatus } from '../enums/match.enums';

export class ListMatchesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(MatchStage, { message: VALIDATION_MESSAGES.stage })
  public stage?: MatchStage;

  @IsOptional()
  @IsUUID('4', { message: VALIDATION_MESSAGES.groupId })
  public groupId?: string;

  @IsOptional()
  @IsEnum(MatchRound, { message: VALIDATION_MESSAGES.round })
  public round?: MatchRound;

  @IsOptional()
  @IsEnum(MatchStatus, { message: VALIDATION_MESSAGES.matchStatus })
  public status?: MatchStatus;

  @IsOptional()
  @IsUUID('4', { message: VALIDATION_MESSAGES.teamId })
  public teamId?: string;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: VALIDATION_MESSAGES.dateTime })
  public scheduledFrom?: string;

  @IsOptional()
  @IsISO8601({ strict: true }, { message: VALIDATION_MESSAGES.dateTime })
  public scheduledTo?: string;
}
