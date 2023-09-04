import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/createGame.dto';
import { IGameRequest } from 'src/types';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Post('create')
  async createGame(@Body() game: CreateGameDto) {
    return await this.gamesService.createGame(game);
  }

  @Get('rating/:game_id')
  async getPlatformRating(@Param() { game_id }: Partial<IGameRequest>) {
    return await this.gamesService.getPlatformRating(game_id);
  }

  @Post('vote')
  async voteForGame(@Body() data: IGameRequest) {
    await this.gamesService.setRatingVote(data);
  }
}
