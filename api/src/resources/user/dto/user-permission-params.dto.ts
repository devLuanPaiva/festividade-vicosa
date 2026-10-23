import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { Permission } from '../../role/enums/permission.enum';

export class UserPermissionParamsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public id!: number;

  @IsEnum(Permission)
  public permission!: Permission;
}
