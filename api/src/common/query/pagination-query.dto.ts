import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { VALIDATION_MESSAGES } from '../validation/validation-messages';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: VALIDATION_MESSAGES.offset })
  @Min(0, { message: VALIDATION_MESSAGES.offset })
  public offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: VALIDATION_MESSAGES.limit })
  @Min(1, { message: VALIDATION_MESSAGES.limit })
  public limit?: number;
}
