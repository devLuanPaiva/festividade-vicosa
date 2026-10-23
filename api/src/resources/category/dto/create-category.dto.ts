import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { RequiredName } from '../../../common/validation/field-decorators';
import {
  MAX_AGE_RANGE_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';
import { Gender } from '../enums/gender.enum';

export class CreateCategoryDto {
  @RequiredName()
  public name!: string;

  @IsEnum(Gender, { message: VALIDATION_MESSAGES.gender })
  public gender!: Gender;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.ageRange })
  @MaxLength(MAX_AGE_RANGE_LENGTH, { message: VALIDATION_MESSAGES.ageRange })
  public ageRange?: string;
}
