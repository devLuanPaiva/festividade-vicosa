import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MatchResultType, MatchRound, MatchStage, MatchStatus } from '../enums/match.enums';

@Entity('match')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public categoryId!: string;

  @Column({ type: 'varchar' })
  public stage!: MatchStage;

  @Column({ type: 'uuid', nullable: true })
  public groupId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  public round!: MatchRound | null;

  @Column({ type: 'timestamptz' })
  public scheduledAt!: Date;

  @Column({ type: 'varchar', nullable: true })
  public location!: string | null;

  @Column({ type: 'varchar' })
  public status!: MatchStatus;

  @Column({ type: 'uuid' })
  public teamAId!: string;

  @Column({ type: 'uuid' })
  public teamBId!: string;

  @Column({ type: 'varchar' })
  public resultType!: MatchResultType;

  @Column({ type: 'smallint', nullable: true })
  public scoreA!: number | null;

  @Column({ type: 'smallint', nullable: true })
  public scoreB!: number | null;

  @Column({ type: 'smallint', nullable: true })
  public penaltiesA!: number | null;

  @Column({ type: 'smallint', nullable: true })
  public penaltiesB!: number | null;

  @Column({ type: 'uuid', nullable: true })
  public winnerId!: string | null;

  @Column({ type: 'uuid', nullable: true })
  public finalizedById!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  public finalizedAt!: Date | null;

  @Column({ type: 'varchar', nullable: true })
  public bestPlayerName!: string | null;

  @Column({ type: 'varchar', nullable: true })
  public bestPlayerPhotoKey!: string | null;

  @Column({ type: 'uuid', nullable: true })
  public bestPlayerTeamId!: string | null;
}
