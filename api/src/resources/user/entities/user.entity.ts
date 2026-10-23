import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  public id!: number;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'varchar' })
  public email!: string;

  @Column({ type: 'varchar' })
  public passwordHash!: string;

  @Column({ type: 'boolean', default: true })
  public active!: boolean;

  @Column({ type: 'int' })
  public roleId!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;
}
