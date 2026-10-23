import type { Permission } from '../enums/permission.enum';
import type { RoleCode } from '../enums/role-code.enum';

export interface RoleResponseDto {
  code: RoleCode;
  name: string;
  permissions: Permission[];
}
