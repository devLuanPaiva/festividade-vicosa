import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('user_roles')
export class UserRole {
  @PrimaryColumn({ type: 'uuid' })
  public userId!: string;

  @PrimaryColumn({ type: 'uuid' })
  public roleId!: string;

  @Column({ type: 'boolean', default: false })
  public isPrimary!: boolean;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  public role!: Role;
}
