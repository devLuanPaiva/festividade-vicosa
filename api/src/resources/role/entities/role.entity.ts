import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleCode } from '../enums/role-code.enum';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  public id!: number;

  @Column({ type: 'varchar', unique: true })
  public code!: RoleCode;

  @Column({ type: 'varchar' })
  public name!: string;
}
