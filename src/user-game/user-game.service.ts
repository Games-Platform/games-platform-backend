import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserGame } from './entity/user-game.entity';
import { CreateUserGameDto } from './dto/createUserGame.dto';
import { User } from 'src/users/entity/user.entity';
import { Game } from 'src/games/entity/game.entity';

@Injectable()
export class UserGameService {
  constructor(
    @InjectRepository(UserGame)
    private readonly userGameRepository: Repository<UserGame>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async createUserGame(createUserGameDto: CreateUserGameDto, user: User) {
    const { game } = createUserGameDto;

    const currentGame = await this.gameRepository.findOne({
      where: { game_id: String(game) },
    });

    const isExistUserGame = await this.userGameRepository.findOne({
      where: { game: currentGame, user },
    });

    if (isExistUserGame) return;

    const userGame = this.userGameRepository.create({
      ...createUserGameDto,
      game: currentGame,
    });

    return await this.userGameRepository.save(userGame);
  }

  async setUserRating(user: User, game: number, rating: number) {
    const currentGame = await this.gameRepository.findOne({
      where: { game_id: String(game) },
    });

    await this.userGameRepository.update(
      { user, game: currentGame },
      { rating },
    );

    return { message: 'Rating have been updated!' };
  }

  async setGameStatus(user: User, game: number, status: number) {
    const currentGame = await this.gameRepository.findOne({
      where: { game_id: String(game) },
    });

    await this.userGameRepository.update(
      { user, game: currentGame },
      { status },
    );

    return { message: 'Status have been updated!' };
  }

  async getUserRating(user: User, game: number) {
    const currentGame = await this.gameRepository.findOne({
      where: { game_id: String(game) },
    });

    const userGame = await this.userGameRepository.findOne({
      where: { game: currentGame, user },
    });

    if (!userGame) return { rating: 0 };

    return { rating: userGame.rating };
  }

  async getGameStatus(user: User, game: number) {
    const currentGame = await this.gameRepository.findOne({
      where: { game_id: String(game) },
    });

    const userGame = await this.userGameRepository.findOne({
      where: { game: currentGame, user },
    });

    if (!userGame) return { status: 0 };

    return { status: userGame.status };
  }

  async getUserGames(user: User) {
    const userGames = await this.userGameRepository.find({
      where: { user },
      relations: ['game'],
    });

    return userGames;
  }
}
