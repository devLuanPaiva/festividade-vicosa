import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('album')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid', nullable: true })
  public subEventId!: string | null;

  @Column({ type: 'date', nullable: true })
  public eventDate!: string | null;

  @Column({ type: 'uuid', nullable: true })
  public matchId!: string | null;
}
