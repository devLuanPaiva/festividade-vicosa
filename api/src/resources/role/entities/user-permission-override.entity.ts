import { Column, Entity, PrimaryColumn } from 'typeorm';
import { PermissionEffect } from '../enums/permission-effect.enum';
import { Permission } from '../enums/permission.enum';

@Entity('user_permission_overrides')
export class UserPermissionOverride {
  @PrimaryColumn({ type: 'int' })
  public userId!: number;

  @PrimaryColumn({ type: 'varchar' })
  public permissionCode!: Permission;

  @Column({ type: 'varchar' })
  public effect!: PermissionEffect;
}
