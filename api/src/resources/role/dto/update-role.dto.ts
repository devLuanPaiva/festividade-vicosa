import { RequiredName } from '../../../common/validation/field-decorators';

export class UpdateRoleDto {
  @RequiredName()
  public name!: string;
}
