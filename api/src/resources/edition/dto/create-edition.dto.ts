import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { OptionalDescription, RequiredName } from '../../../common/validation/field-decorators';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';

const MIN_YEAR = 2000;
const MAX_YEAR = 2100;

export class CreateEditionDto {
  @Type(() => Number)
  @IsInt({ message: VALIDATION_MESSAGES.year })
  @Min(MIN_YEAR, { message: VALIDATION_MESSAGES.year })
  @Max(MAX_YEAR, { message: VALIDATION_MESSAGES.year })
  public year!: number;

  @RequiredName()
  public name!: string;

  @OptionalDescription()
  public description?: string;
}
