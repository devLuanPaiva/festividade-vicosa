import { RequiredName } from '../../../common/validation/field-decorators';
import { SetRolePermissionsDto } from './set-role-permissions.dto';

export class CreateRoleDto extends SetRolePermissionsDto {
  @RequiredName()
  public name!: string;
}
