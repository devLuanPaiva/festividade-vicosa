import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('team')
export class Team {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  public id!: number;

  @Column({ type: 'int' })
  public categoryId!: number;

  @Column({ type: 'int', nullable: true })
  public groupId!: number | null;

  @Column({ type: 'varchar' })
  public name!: string;
}
