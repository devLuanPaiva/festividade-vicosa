import { IsEnum, IsOptional } from 'class-validator';
import { SearchQueryDto } from '../../../common/query/search-query.dto';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { Gender } from '../enums/gender.enum';

export class ListCategoriesQueryDto extends SearchQueryDto {
  @IsOptional()
  @IsEnum(Gender, { message: VALIDATION_MESSAGES.gender })
  public gender?: Gender;
}
