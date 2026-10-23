import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { RequiredName } from '../../../common/validation/field-decorators';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';

export class CreateTeamDto {
  @RequiredName()
  public name!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: VALIDATION_MESSAGES.groupId })
  @Min(1, { message: VALIDATION_MESSAGES.groupId })
  public groupId?: number | null;
}
