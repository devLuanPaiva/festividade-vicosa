import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { SearchQueryDto } from '../../../common/query/search-query.dto';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

export class ListEditionsQueryDto extends SearchQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: VALIDATION_MESSAGES.year })
  @Min(MIN_YEAR, { message: VALIDATION_MESSAGES.year })
  @Max(MAX_YEAR, { message: VALIDATION_MESSAGES.year })
  public year?: number;
}
