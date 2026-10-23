import { IsEnum } from 'class-validator';
import { PermissionEffect } from '../../role/enums/permission-effect.enum';

export class SetPermissionOverrideDto {
  @IsEnum(PermissionEffect)
  public effect!: PermissionEffect;
}
