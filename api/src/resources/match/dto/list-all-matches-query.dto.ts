import { IsEnum, IsIn, IsOptional, IsString, IsUUID, Matches, MaxLength } from 'class-validator';
import {
  MAX_SEARCH_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';
import { MatchSituation } from '../rules/match-situation.rule';
import { ListMatchesQueryDto } from './list-matches-query.dto';

export const MATCH_ORDERS = ['asc', 'desc'];
const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class ListAllMatchesQueryDto extends ListMatchesQueryDto {
  @IsOptional()
  @IsUUID('4', { message: VALIDATION_MESSAGES.categoryId })
  public categoryId?: string;

  @IsOptional()
  @IsUUID('4', { message: VALIDATION_MESSAGES.subEventId })
  public subEventId?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.search })
  @MaxLength(MAX_SEARCH_LENGTH, { message: VALIDATION_MESSAGES.search })
  public search?: string;

  @IsOptional()
  @Matches(DAY_PATTERN, { message: VALIDATION_MESSAGES.day })
  public day?: string;

  @IsOptional()
  @IsEnum(MatchSituation, { message: VALIDATION_MESSAGES.situation })
  public situation?: MatchSituation;

  @IsOptional()
  @IsIn(MATCH_ORDERS, { message: VALIDATION_MESSAGES.order })
  public order?: string;
}
