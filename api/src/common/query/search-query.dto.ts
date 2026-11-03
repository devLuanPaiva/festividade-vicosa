import { IsOptional, IsString, MaxLength } from 'class-validator';
import { MAX_SEARCH_LENGTH, VALIDATION_MESSAGES } from '../validation/validation-messages';
import { PaginationQueryDto } from './pagination-query.dto';

export class SearchQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.search })
  @MaxLength(MAX_SEARCH_LENGTH, { message: VALIDATION_MESSAGES.search })
  public search?: string;
}
