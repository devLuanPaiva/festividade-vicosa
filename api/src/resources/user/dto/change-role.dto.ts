import { IsEnum } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';
import { RoleCode } from '../../role/enums/role-code.enum';

export class ChangeRoleDto {
  @IsEnum(RoleCode, { message: VALIDATION_MESSAGES.roleCode })
  public roleCode!: RoleCode;
}
