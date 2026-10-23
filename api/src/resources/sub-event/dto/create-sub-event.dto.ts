import { IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { OptionalDescription, RequiredName } from '../../../common/validation/field-decorators';
import {
  ISO_DATE_PATTERN,
  MAX_LOCATION_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';
import { SubEventType } from '../enums/sub-event-type.enum';

export class CreateSubEventDto {
  @IsEnum(SubEventType, { message: VALIDATION_MESSAGES.subEventType })
  public type!: SubEventType;

  @RequiredName()
  public name!: string;

  @OptionalDescription()
  public description?: string;

  @Matches(ISO_DATE_PATTERN, { message: VALIDATION_MESSAGES.date })
  public startDate!: string;

  @Matches(ISO_DATE_PATTERN, { message: VALIDATION_MESSAGES.date })
  public endDate!: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.location })
  @MaxLength(MAX_LOCATION_LENGTH, { message: VALIDATION_MESSAGES.location })
  public location?: string;
}
