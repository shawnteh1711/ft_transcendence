import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class MatchHistory {
  @PrimaryGeneratedColumn()
  match_uid: number;

  @Column()
  winner_uid: number;

  @ManyToOne(() => User, (user) => user.p1_match, { nullable: false })
  p1_uid: User;

  @ManyToOne(() => User, (user) => user.p2_match, { nullable: false })
  p2_uid: User;

  @Column({ default: 0 })
  p1_score: number;

  @Column({ default: 0 })
  p2_score: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  date_of_creation: Date;
}
