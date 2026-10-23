import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/query/pagination-query.dto';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { SubEventType } from '../enums/sub-event-type.enum';

export class ListSubEventsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(SubEventType, { message: VALIDATION_MESSAGES.subEventType })
  public type?: SubEventType;
}
