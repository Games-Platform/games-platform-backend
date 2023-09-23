import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entity/game.entity';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/createGame.dto';
import { IGameRequest } from 'src/types';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  ) {}

  async createGame(game: CreateGameDto) {
    try {
      const existGame = await this.gameRepository.findOne({
        where: { game_id: game.game_id },
      });

      if (existGame) return;

      if (!game.metacritic) {
        game.metacritic = 0;
      }

      return await this.gameRepository.save(game);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getPlatformRating(game_id: string) {
    try {
      const game = await this.gameRepository.findOne({ where: { game_id } });

      const currentRating = game.games_platform_rating / game.rating_votes;

      return currentRating.toFixed(1);
    } catch (error) {
      throw new Error(error);
    }
  }

  async setRatingVote({ game_id, value, vote }: IGameRequest) {
    try {
      const game = await this.gameRepository.findOne({ where: { game_id } });

      await this.gameRepository.save({
        ...game,
        rating_votes:
          game.games_platform_rating === 0 ? 1 : game.rating_votes + vote,
        games_platform_rating: game.games_platform_rating + value,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
