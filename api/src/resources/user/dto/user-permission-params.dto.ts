import { IsEnum, IsUUID } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { Permission } from '../../role/enums/permission.enum';

export class UserPermissionParamsDto {
  @IsUUID('4', { message: VALIDATION_MESSAGES.id })
  public id!: string;

  @IsEnum(Permission, { message: VALIDATION_MESSAGES.permission })
  public permission!: Permission;
}
