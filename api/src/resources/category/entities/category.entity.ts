import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from '../enums/gender.enum';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public subEventId!: string;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'varchar' })
  public gender!: Gender;

  @Column({ type: 'varchar', nullable: true })
  public ageRange!: string | null;
}
