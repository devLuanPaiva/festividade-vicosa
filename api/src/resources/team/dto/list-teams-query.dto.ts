import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { SearchQueryDto } from '../../../common/query/search-query.dto';
import {
  MAX_CITY_LENGTH,
  VALIDATION_MESSAGES,
} from '../../../common/validation/validation-messages';

export class ListTeamsQueryDto extends SearchQueryDto {
  @IsOptional()
  @IsUUID('4', { message: VALIDATION_MESSAGES.groupId })
  public groupId?: string;

  @IsOptional()
  @IsString({ message: VALIDATION_MESSAGES.cityTooLong })
  @MaxLength(MAX_CITY_LENGTH, { message: VALIDATION_MESSAGES.cityTooLong })
  public city?: string;
}
