import { RequiredName } from '../../../common/validation/field-decorators';

export class CreateMatchGroupDto {
  @RequiredName()
  public name!: string;
}
