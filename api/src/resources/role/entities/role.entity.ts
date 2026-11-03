import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', unique: true })
  public code!: string;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'boolean', default: false })
  public system!: boolean;
}
