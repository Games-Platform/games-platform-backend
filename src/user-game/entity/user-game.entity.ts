import { Game } from 'src/games/entity/game.entity';
import { User } from '../../users/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  rating: number;

  @Column({ default: 0 })
  status: number;

  @ManyToOne(() => Game, ({ game }) => game, { onDelete: 'CASCADE' })
  game: Game;

  @ManyToOne(() => User, ({ games }) => games, { onDelete: 'CASCADE' })
  user: User;
}
