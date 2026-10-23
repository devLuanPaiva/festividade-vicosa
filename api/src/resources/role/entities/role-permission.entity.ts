import { Entity, PrimaryColumn } from 'typeorm';
import { Permission } from '../enums/permission.enum';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryColumn({ type: 'uuid' })
  public roleId!: string;

  @PrimaryColumn({ type: 'varchar' })
  public permissionCode!: Permission;
}
