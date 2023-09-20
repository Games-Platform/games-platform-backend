import { UserGame } from 'src/user-game/entity/user-game.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  game_id: string;

  @Column({
    nullable: false,
    default: '',
  })
  background_image: string;

  @Column({
    nullable: false,
    default: 0,
  })
  metacritic: number;

  @Column({
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    nullable: false,
    default: 0,
  })
  games_platform_rating: number;

  @Column({
    nullable: false,
    default: 1,
  })
  rating_votes: number;

  @OneToMany(() => UserGame, ({ game }) => game)
  game: UserGame[];
}
