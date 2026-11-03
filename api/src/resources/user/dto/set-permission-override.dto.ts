import { IsEnum } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { PermissionEffect } from '../../role/enums/permission-effect.enum';

export class SetPermissionOverrideDto {
  @IsEnum(PermissionEffect, { message: VALIDATION_MESSAGES.permissionEffect })
  public effect!: PermissionEffect;
}
