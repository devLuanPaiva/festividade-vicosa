import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('edition')
export class Edition {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'int', unique: true })
  public year!: number;

  @Column({ type: 'varchar' })
  public name!: string;

  @Column({ type: 'varchar', nullable: true })
  public description!: string | null;
}
