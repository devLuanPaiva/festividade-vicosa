import { ArrayUnique, IsArray, IsEnum } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { Permission } from '../enums/permission.enum';

export class SetRolePermissionsDto {
  @IsArray({ message: VALIDATION_MESSAGES.permissionList })
  @ArrayUnique({ message: VALIDATION_MESSAGES.permissionList })
  @IsEnum(Permission, { each: true, message: VALIDATION_MESSAGES.permissionList })
  public permissions!: Permission[];
}
