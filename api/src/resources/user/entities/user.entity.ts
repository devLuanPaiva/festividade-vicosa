import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'varchar' })
  public email!: string;

  @Column({ type: 'varchar' })
  public passwordHash!: string;

  @Column({ type: 'boolean', default: true })
  public active!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;
}
