import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('match_group')
export class MatchGroup {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public categoryId!: string;

  @Column({ type: 'varchar' })
  public name!: string;
}
