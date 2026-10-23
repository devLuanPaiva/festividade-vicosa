import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleCode } from '../enums/role-code.enum';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', unique: true })
  public code!: RoleCode;

  @Column({ type: 'varchar' })
  public name!: string;
}
