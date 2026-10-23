import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match_group')
export class MatchGroup {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  public id!: number;

  @Column({ type: 'int' })
  public categoryId!: number;

  @Column({ type: 'varchar' })
  public name!: string;
}
