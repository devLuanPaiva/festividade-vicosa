import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { Permission } from '../../role/enums/permission.enum';

export class UserPermissionParamsDto {
  @Type(() => Number)
  @IsInt({ message: VALIDATION_MESSAGES.id })
  @Min(1, { message: VALIDATION_MESSAGES.id })
  public id!: number;

  @IsEnum(Permission, { message: VALIDATION_MESSAGES.permission })
  public permission!: Permission;
}
