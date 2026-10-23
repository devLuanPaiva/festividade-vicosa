import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('qualified_team')
export class QualifiedTeam {
  @PrimaryColumn({ type: 'uuid' })
  public groupId!: string;

  @PrimaryColumn({ type: 'uuid' })
  public teamId!: string;

  @Column({ type: 'smallint' })
  public position!: number;
}
