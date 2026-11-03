import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { RequiredName } from '../../../common/validation/field-decorators';
import {
  MAX_ABBREVIATION_LENGTH,
  MAX_CITY_LENGTH,
  MAX_PHOTO_KEY_LENGTH,
  MIN_ABBREVIATION_LENGTH,
  SLUG_PATTERN,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';

export class CreateTeamDto {
  @RequiredName()
  public name!: string;

  @IsOptional()
  @Matches(SLUG_PATTERN, { message: VALIDATION_MESSAGES.slug })
  public slug?: string;

  @IsString({ message: VALIDATION_MESSAGES.cityRequired })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.cityRequired })
  @MaxLength(MAX_CITY_LENGTH, { message: VALIDATION_MESSAGES.cityTooLong })
  public city!: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.abbreviation })
  @Length(MIN_ABBREVIATION_LENGTH, MAX_ABBREVIATION_LENGTH, {
    message: VALIDATION_MESSAGES.abbreviation,
  })
  public abbreviation?: string | null;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.photoKey })
  @MaxLength(MAX_PHOTO_KEY_LENGTH, { message: VALIDATION_MESSAGES.photoKey })
  public photoKey?: string | null;

  @IsOptional()
  @IsUUID('4', { message: VALIDATION_MESSAGES.groupId })
  public groupId?: string | null;
}
