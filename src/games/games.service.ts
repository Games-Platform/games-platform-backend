import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entity/game.entity';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/createGame.dto';
import { IGameRequest } from 'src/types';
import { GamePlatformService } from 'src/game-platform/game-platform.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly gamePlatformService: GamePlatformService,
  ) {}

  async createGame(game: CreateGameDto) {
    const { gamePlatforms, ...gameData } = game;

    try {
      const existGame = await this.gameRepository.findOne({
        where: { game_id: gameData.game_id },
      });

      if (existGame) return;

      if (!gameData.metacritic) {
        gameData.metacritic = 0;
      }

      const currentGame = await this.gameRepository.save(gameData);

      this.addPlatformsToGame(currentGame.id, gamePlatforms);

      return currentGame;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getPlatformRating(game_id: string) {
    try {
      const game = await this.gameRepository.findOne({
        where: { game_id },
        relations: ['gamePlatforms'],
      });

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

  async getAllGames(): Promise<Game[]> {
    return this.gameRepository.find({
      relations: ['gamePlatforms'],
    });
  }

  async getGameById(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['gamePlatforms'],
    });

    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }

  async addPlatformsToGame(
    gameId: number,
    platformNames: string[],
  ): Promise<Game> {
    const game = await this.getGameById(gameId);

    const existingPlatforms = await Promise.all(
      platformNames.map(async (platformName) => {
        const existingPlatforms =
          await this.gamePlatformService.getPlatformByName(platformName);

        if (existingPlatforms) {
          return existingPlatforms;
        }

        const newPlatform = await this.gamePlatformService.createPlatform(
          platformName,
        );

        return newPlatform;
      }),
    );

    game.gamePlatforms.push(...existingPlatforms);

    return this.gameRepository.save(game);
  }
}
