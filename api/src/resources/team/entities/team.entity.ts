import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('team')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public categoryId!: string;

  @Column({ type: 'uuid', nullable: true })
  public groupId!: string | null;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'varchar' })
  public slug!: string;

  @Column({ type: 'varchar' })
  public city!: string;

  @Column({ type: 'varchar', nullable: true })
  public abbreviation!: string | null;

  @Column({ type: 'varchar', nullable: true })
  public photoKey!: string | null;
}
