import { IsEnum } from 'class-validator';
import { RoleCode } from '../../role/enums/role-code.enum';

export class ChangeRoleDto {
  @IsEnum(RoleCode)
  public roleCode!: RoleCode;
}
