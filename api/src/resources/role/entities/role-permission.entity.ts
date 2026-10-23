import { Entity, PrimaryColumn } from 'typeorm';
import { Permission } from '../enums/permission.enum';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryColumn({ type: 'int' })
  public roleId!: number;

  @PrimaryColumn({ type: 'varchar' })
  public permissionCode!: Permission;
}
