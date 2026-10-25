import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { CreateMatchDto } from './create-match.dto';

export const MAX_BATCH_MATCHES = 64;
const MAX_BRACKET_POSITION = 15;

export class BatchMatchDto extends CreateMatchDto {
  @IsOptional()
  @IsInt({ message: VALIDATION_MESSAGES.bracketPosition })
  @Min(0, { message: VALIDATION_MESSAGES.bracketPosition })
  @Max(MAX_BRACKET_POSITION, { message: VALIDATION_MESSAGES.bracketPosition })
  public bracketPosition?: number;
}

export class CreateMatchBatchDto {
  @IsArray({ message: VALIDATION_MESSAGES.matchBatch })
  @ArrayMinSize(1, { message: VALIDATION_MESSAGES.matchBatch })
  @ArrayMaxSize(MAX_BATCH_MATCHES, { message: VALIDATION_MESSAGES.matchBatch })
  @ValidateNested({ each: true })
  @Type(() => BatchMatchDto)
  public matches!: BatchMatchDto[];
}
