import { IsOptional, IsUUID } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { ListMatchesQueryDto } from './list-matches-query.dto';

export class ListAllMatchesQueryDto extends ListMatchesQueryDto {
  @IsOptional()
  @IsUUID('4', { message: VALIDATION_MESSAGES.categoryId })
  public categoryId?: string;

  @IsOptional()
  @IsUUID('4', { message: VALIDATION_MESSAGES.subEventId })
  public subEventId?: string;
}
