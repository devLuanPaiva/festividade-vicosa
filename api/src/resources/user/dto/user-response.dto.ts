import type { RoleCode } from '../../role/enums/role-code.enum';

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  active: boolean;
  roleCode: RoleCode;
  createdAt: Date;
}
