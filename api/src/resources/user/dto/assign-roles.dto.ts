import { ArrayNotEmpty, ArrayUnique, IsArray, IsUUID } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../../common/validation/validation-messages';

export class AssignRolesDto {
  @IsArray({ message: VALIDATION_MESSAGES.roleIds })
  @ArrayNotEmpty({ message: VALIDATION_MESSAGES.roleIds })
  @ArrayUnique({ message: VALIDATION_MESSAGES.roleIds })
  @IsUUID('4', { each: true, message: VALIDATION_MESSAGES.roleIds })
  public roleIds!: string[];

  @IsUUID('4', { message: VALIDATION_MESSAGES.roleId })
  public primaryRoleId!: string;
}
