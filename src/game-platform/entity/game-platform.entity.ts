import { Game } from 'src/games/entity/game.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GamePlatform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  platform: string;

  @ManyToMany(() => Game, (game) => game.gamePlatforms)
  games: Game[];
}
