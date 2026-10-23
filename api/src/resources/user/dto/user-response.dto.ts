import type { RoleCode } from '../../role/enums/role-code.enum';

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  active: boolean;
  roleCode: RoleCode;
  createdAt: Date;
}
