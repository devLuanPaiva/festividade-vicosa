import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SubEventType } from '../enums/sub-event-type.enum';

@Entity('sub_event')
export class SubEvent {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public editionId!: string;

  @Column({ type: 'varchar' })
  public type!: SubEventType;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'varchar', nullable: true })
  public description!: string | null;

  @Column({ type: 'date' })
  public startDate!: string;

  @Column({ type: 'date' })
  public endDate!: string;

  @Column({ type: 'varchar', nullable: true })
  public location!: string | null;
}
