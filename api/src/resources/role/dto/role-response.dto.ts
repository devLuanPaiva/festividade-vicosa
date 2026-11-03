import type { Permission } from '../enums/permission.enum';

export interface RoleResponseDto {
  id: string;
  code: string;
  name: string;
  system: boolean;
  permissions: Permission[];
  userCount: number;
}
